import { Template } from '../../types';
import { ApiResponse } from '../types';

export const createTrustSignalTemplate = async (
  apiKey: string,
  template: Template
): Promise<ApiResponse> => {
  try {
    console.log('Creating template with data:', template);

    // Use full language code as provided
    const langCode = template.language; // Keep "en_US" format

    // Check if this is a document template (which has a different structure)
    const isDocumentTemplate =
      template.headerType === 'MEDIA' && template.mediaType === 'DOCUMENT';

    let raw = '';

    if (isDocumentTemplate) {
      // Document template uses a different structure
      raw = buildDocumentTemplateRaw(template, langCode);
    } else {
      // Regular template uses a standard components array
      raw = buildRegularTemplateRaw(template, langCode);
    }

    console.log('Raw JSON string being sent:', raw);

    // Request configuration
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: raw,
      redirect: 'follow' as RequestRedirect,
    };

    console.log(
      'Making request to:',
      `https://wpapi.trustsignal.io/api/v1/template?api_key=${apiKey}`
    );
    console.log('Request options:', requestOptions);

    const response = await fetch(
      `https://wpapi.trustsignal.io/api/v1/template?api_key=${apiKey}`,
      requestOptions
    );

    console.log('Response status:', response.status);
    console.log(
      'Response headers:',
      Object.fromEntries(response.headers.entries())
    );

    const result = await response.text();
    console.log('Raw response:', result);

    const data = JSON.parse(result);
    console.log('Parsed response:', data);

    if (!data.success) {
      throw new Error(data.message || 'Template creation failed');
    }

    return {
      status: 'success',
      message: 'Template created successfully',
      data: {
        template: data.template,
        details: [
          {
            template_name: data.template?.name || template.name,
            template_id: data.template?.id || 'unknown',
            meta_tid: data.template?.meta_tid,
            status: data.template?.status,
            quality: data.template?.quality,
            temp_route: data.template?.temp_route,
            temptype: data.template?.temptype,
          },
        ],
      },
    };
  } catch (error) {
    console.error('TrustSignal API Error:', error);
    return {
      status: 'error',
      message:
        error instanceof Error ? error.message : 'Failed to create template',
    };
  }
};

// CORRECTED: Build document template payload to match the required API structure.
const buildDocumentTemplateRaw = (template: Template, langCode: string): string => {
  const payload: any = {
    name: template.name,
    lang: langCode,
    category: template.category,
    components: [], // Components should be an array
  };

  // Add top-level media object and the HEADER component
  if (template.headerType === 'MEDIA' && template.mediaUrl) {
    payload.media = {
      header: template.mediaUrl,
    };
    payload.components.push({
      type: 'HEADER',
      format: 'DOCUMENT',
    });
  }

  // Build and push the BODY component
  const bodyVariables = extractVariables(template.body);
  const bodyComponent: any = {
    type: 'BODY',
    text: template.body,
  };
  if (bodyVariables.length > 0 && template.sampleContent?.bodyVariables) {
    const bodySampleValues = getBodySampleValues(template, bodyVariables);
    bodyComponent.example = {
      body_text: [bodySampleValues], // This creates the required nested array
    };
  }
  payload.components.push(bodyComponent);

  // Build and push the FOOTER component if it exists
  if (template.footer?.trim()) {
    payload.components.push({
      type: 'FOOTER',
      text: template.footer,
    });
  }

  // Build and push the BUTTONS component if buttons exist
  if (template.buttons && template.buttons.length > 0) {
    const buttons = template.buttons.map(button => {
      const buttonData: any = {
        type: button.type === 'CALL' ? 'PHONE_NUMBER' : button.type,
        text: button.text,
      };

      if (button.type === 'URL' && button.value) {
        buttonData.url = button.value;

        // Dynamic URL variables
        if (button.urlType === 'dynamic' && button.value.includes('{{')) {
          const urlVariables = extractVariables(button.value);
          if (urlVariables.length > 0 && template.sampleContent?.buttonVariables) {
            const urlSampleValues = urlVariables.map(
              ({ number }) =>
                template.sampleContent?.buttonVariables?.[number] ||
                `sample${number}`
            );
            buttonData.example = urlSampleValues;
          }
        }
      }

      if (button.type === 'CALL' && button.value) {
        buttonData.phone_number = button.value.startsWith('+')
          ? button.value
          : `+${button.value}`;
      }

      return buttonData;
    });

    payload.components.push({
      type: 'BUTTONS',
      buttons: buttons,
    });
  }

  return JSON.stringify(payload);
};

// Build regular template (components array) - No changes needed here.
const buildRegularTemplateRaw = (template: Template, langCode: string): string => {
  const payload: any = {
    name: template.name,
    lang: langCode,
    category: template.category,
    shortlink: template.enableClickTracking ? '1' : '0',
    components: [],
  };

  // Add media section if header has media (but not for document)
  if (
    template.headerType === 'MEDIA' &&
    template.mediaUrl &&
    template.mediaType !== 'DOCUMENT'
  ) {
    payload.media = {
      header: template.mediaUrl,
    };
  }

  // Build components array
  const components: any[] = [];

  // Add header component
  if (template.headerType === 'TEXT' && template.headerText) {
    const headerVariables = extractVariables(template.headerText);
    const headerComponent = {
      type: 'HEADER',
      format: 'TEXT',
      text: template.headerText,
      ...(headerVariables.length > 0 &&
        template.sampleContent?.headerVariables && {
          example: {
            header_text: getHeaderSampleValues(template, headerVariables),
          },
        }),
    };
    components.push(headerComponent);
  } else if (template.headerType === 'MEDIA') {
    const headerComponent = {
      type: 'HEADER',
      format: template.mediaType || 'IMAGE',
    };
    components.push(headerComponent);
  }

  // Add body component
  const bodyVariables = extractVariables(template.body);
  const bodyComponent = {
    type: 'BODY',
    text: template.body,
    ...(bodyVariables.length > 0 &&
      template.sampleContent?.bodyVariables && {
        example: {
          body_text: [getBodySampleValues(template, bodyVariables)],
        },
      }),
  };
  components.push(bodyComponent);

  // Add footer component
  if (template.footer) {
    components.push({
      type: 'FOOTER',
      text: template.footer,
    });
  }

  // Add buttons component
  if (template.buttons.length > 0) {
    const buttons = template.buttons.map(button => {
      const buttonData: any = {
        type: button.type === 'CALL' ? 'PHONE_NUMBER' : button.type,
        text: button.text,
      };

      if (button.type === 'URL' && button.value) {
        buttonData.url = button.value;

        // Add URL example if it's a dynamic URL with variables
        if (button.urlType === 'dynamic' && button.value.includes('{{')) {
          const urlVariables = extractVariables(button.value);
          if (
            urlVariables.length > 0 &&
            template.sampleContent?.buttonVariables
          ) {
            const urlSampleValues = urlVariables.map(
              ({ number }) =>
                template.sampleContent?.buttonVariables?.[number] ||
                `sample${number}`
            );
            buttonData.example = urlSampleValues;
          }
        }
      }

      if (button.type === 'CALL' && button.value) {
        buttonData.phone_number = button.value;
      }

      return buttonData;
    });

    components.push({
      type: 'BUTTONS',
      buttons: buttons,
    });
  }

  payload.components = components;
  return JSON.stringify(payload);
};

// Helpers
const extractVariables = (
  text: string
): { variable: string; number: string }[] => {
  const matches = text.match(/\{\{(\d+)\}\}/g) || [];
  return matches.map(match => ({
    variable: match.replace(/[{}]/g, ''),
    number: match.replace(/[{}]/g, ''),
  }));
};

const getHeaderSampleValues = (
  template: Template,
  headerVariables: { variable: string; number: string }[]
): string[] => {
  return headerVariables.map(
    ({ number }) =>
      template.sampleContent?.headerVariables?.[number] || `Sample ${number}`
  );
};

const getBodySampleValues = (
  template: Template,
  bodyVariables: { variable: string; number: string }[]
): string[] => {
  return bodyVariables.map(
    ({ number }) =>
      template.sampleContent?.bodyVariables?.[number] || `Sample ${number}`
  );
};
