import { ApiCredentials, ApiResponse, TemplateListResponse, TrustSignalTemplate } from '../types';

export type TemplateListParams = {
  type?: string;
  limit?: number;
  offset?: number;
};

export const getTemplateList = async (
  credentials: ApiCredentials,
  params: TemplateListParams = {}
): Promise<ApiResponse> => {
  try {
    return await getTrustSignalTemplates(credentials.apiKey);
  } catch (error) {
    console.error('API Error:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to fetch templates',
    };
  }
};

const getTrustSignalTemplates = async (apiKey: string): Promise<ApiResponse> => {
  const response = await fetch(
    'https://wpapi.trustsignal.io/api/v1/template?page=1&limit=100',
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch templates');
  }

  // Transform TrustSignal templates to match common format
  const transformedTemplates: TemplateListResponse[] = data.templates.map((template: TrustSignalTemplate) => ({
    id: template.id,
    name: template.name,
    category: template.category,
    language: template.lang,
    type: template.temptype || 'TEXT',
    body: template.temp_var_data || '',
    status: template.status,
    creation_time: new Date(template.created_at).getTime(),
    updation_time: new Date(template.modified_at).getTime(),
    medialist: template.medialist,
    shortlink: template.shortlink
  }));

  return {
    status: 'success',
    data: transformedTemplates,
    meta: {
      total: data.totalrecords,
      page: data.page,
      limit: data.limit,
    },
  };
};