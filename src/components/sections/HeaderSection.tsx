import React from 'react';
import { Upload, X, Type } from 'lucide-react';
import { Template, HeaderType, MediaType } from '../../types';

type Props = {
  template: Template;
  setTemplate: React.Dispatch<React.SetStateAction<Template>>;
};

const headerTypes: { value: HeaderType; label: string }[] = [
  { value: 'NONE', label: 'None' },
  { value: 'TEXT', label: 'Text' },
  { value: 'MEDIA', label: 'Media' }
];

const mediaTypes: { value: MediaType; label: string }[] = [
  { value: 'IMAGE', label: 'Image' },
  { value: 'DOCUMENT', label: 'Document' },
  { value: 'VIDEO', label: 'Video' }
];

export default function HeaderSection({ template, setTemplate }: Props) {
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [headerTextareaRef, setHeaderTextareaRef] = React.useState<HTMLInputElement | null>(null);

  const getLastVariableNumber = (text: string): number => {
    const matches = text.match(/{{\d+}}/g);
    if (!matches) return 0;
    
    const numbers = matches.map(match => {
      const num = match.match(/{{(\d+)}}/);
      return num ? parseInt(num[1], 10) : 0;
    });
    
    return Math.max(...numbers);
  };

  const addHeaderVariable = () => {
    // Get the highest variable number from header only
    const lastHeaderNumber = getLastVariableNumber(template.headerText);
    const nextNumber = lastHeaderNumber + 1;
    if (headerTextareaRef && template.headerText.length + `{{${nextNumber}}}`.length <= 60) {
      const cursorPosition = headerTextareaRef.selectionStart || template.headerText.length;
      const beforeCursor = template.headerText.substring(0, cursorPosition);
      const afterCursor = template.headerText.substring(cursorPosition);
      const newHeaderText = beforeCursor + `{{${nextNumber}}}` + afterCursor;
      
      setTemplate({ 
        ...template, 
        headerText: newHeaderText
      });
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        if (headerTextareaRef) {
          const newPosition = cursorPosition + `{{${nextNumber}}}`.length;
          headerTextareaRef.setSelectionRange(newPosition, newPosition);
          headerTextareaRef.focus();
        }
      }, 0);
    }
  };

  const handleHeaderTypeChange = (headerType: HeaderType) => {
    setTemplate({
      ...template,
      headerType,
      headerText: headerType === 'TEXT' ? template.headerText : '',
      mediaType: headerType === 'MEDIA' ? (template.mediaType || 'IMAGE') : undefined,
      mediaUrl: headerType === 'MEDIA' ? template.mediaUrl : undefined
    });
    
    // Clear uploaded file when changing header type
    if (headerType !== 'MEDIA') {
      setUploadedFile(null);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadedFile(file);

    try {
      // Create a local URL for the uploaded file
      const fileUrl = URL.createObjectURL(file);
      setTemplate({ ...template, mediaUrl: fileUrl });
    } catch (error) {
      console.error('File upload failed:', error);
      setUploadedFile(null);
      // Show error to user
      alert(error instanceof Error ? error.message : 'File upload failed. Please use a direct URL instead.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeUploadedFile = () => {
    if (uploadedFile && template.mediaUrl) {
      URL.revokeObjectURL(template.mediaUrl);
    }
    setUploadedFile(null);
    setTemplate({ ...template, mediaUrl: '' });
  };

  const getAcceptedFileTypes = () => {
    switch (template.mediaType) {
      case 'IMAGE':
        return 'image/*';
      case 'VIDEO':
        return 'video/*';
      case 'DOCUMENT':
        return '.pdf,.doc,.docx,.txt';
      default:
        return '*/*';
    }
  };

  return (
    <div className="rsp-space-y-6">
      {/* Header Type Selection */}
      <div>
        <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-2">
          Header Type
        </label>
        <div className="rsp-relative">
          <select
            value={template.headerType}
            onChange={(e) => handleHeaderTypeChange(e.target.value as HeaderType)}
            className="rsp-w-full rsp-px-0 rsp-py-2 rsp-border-0 rsp-border-b rsp-border-gray-300 rsp-text-sm focus:rsp-outline-none focus:rsp-border-blue-500 rsp-bg-transparent rsp-appearance-none"
          >
            {headerTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <div className="rsp-absolute rsp-inset-y-0 rsp-right-0 rsp-flex rsp-items-center rsp-px-2 rsp-pointer-events-none">
            <svg className="rsp-w-4 rsp-h-4 rsp-text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className="rsp-absolute rsp-bottom-0 rsp-left-0 rsp-w-4 rsp-h-0.5 rsp-bg-red-500"></div>
        </div>
      </div>

      {/* Header Text Input */}
      {template.headerType === 'TEXT' && (
        <div>
          <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-2">
            Header Text
          </label>
          <div className="rsp-relative">
            <input
              ref={setHeaderTextareaRef}
              type="text"
              value={template.headerText}
              onChange={(e) => setTemplate({ ...template, headerText: e.target.value })}
              maxLength={60}
              className="rsp-w-full rsp-px-0 rsp-py-2 rsp-border-0 rsp-border-b rsp-border-gray-300 rsp-text-sm focus:rsp-outline-none focus:rsp-border-blue-500 rsp-bg-transparent"
              placeholder="Add a 60 character title to your message"
            />
            <div className="rsp-absolute rsp-bottom-0 rsp-left-0 rsp-w-4 rsp-h-0.5 rsp-bg-red-500"></div>
          </div>
          
          {/* Header Toolbar */}
          <div className="rsp-flex rsp-items-center rsp-justify-between rsp-mt-2">
            <div className="rsp-flex rsp-items-center rsp-gap-2">
              <button
                onClick={addHeaderVariable}
                className="rsp-px-2 rsp-py-1 rsp-text-xs rsp-bg-gray-100 hover:rsp-bg-gray-200 rsp-rounded rsp-text-gray-700 rsp-flex rsp-items-center rsp-gap-1"
                title="Add variable to header"
              >
                <Type className="rsp-w-3 rsp-h-3" />
                Add Variable
              </button>
            </div>
            <div className="rsp-flex rsp-items-center rsp-gap-2">
              <span className="rsp-text-xs rsp-text-gray-500">
                {template.headerText.length}/60
              </span>
            </div>
          </div>
          
          <p className="rsp-text-xs rsp-text-gray-500 rsp-mt-1">
            {template.headerText.length}/60 characters
          </p>
          
          {/* Sample Values for Header Variables */}
          {(() => {
            const headerVariables = template.headerText.match(/\{\{(\d+)\}\}/g) || [];
            const uniqueVariables = [...new Set(headerVariables.map(match => match.replace(/[{}]/g, '')))];
            
            if (uniqueVariables.length === 0) return null;
            
            return (
              <div className="rsp-mt-3">
                <p className="rsp-text-xs rsp-font-medium rsp-text-gray-600 rsp-mb-2">Sample Values</p>
                <div className="rsp-grid rsp-grid-cols-2 rsp-gap-2">
                  {uniqueVariables.map((variable) => (
                    <div key={`header-sample-${variable}`} className="rsp-flex rsp-items-center rsp-gap-2">
                      <label className="rsp-text-xs rsp-text-gray-500 rsp-whitespace-nowrap">
                        {'{{'}{variable}{'}}'}: 
                      </label>
                      <input
                        type="text"
                        value={template.sampleContent?.headerVariables?.[variable] || ''}
                        onChange={(e) => {
                          const newSampleContent = {
                            ...template.sampleContent,
                            // FIX: This now correctly targets 'headerVariables' for updates
                            headerVariables: {
                              ...template.sampleContent?.headerVariables,
                              [variable]: e.target.value
                            },
                            // This line correctly preserves the existing body variables
                            bodyVariables: template.sampleContent?.bodyVariables || {}
                          };
                          setTemplate({
                            ...template,
                            sampleContent: newSampleContent
                          });
                        }}
                        className="rsp-flex-1 rsp-px-2 rsp-py-1 rsp-border rsp-border-gray-300 rsp-rounded rsp-text-xs focus:rsp-outline-none focus:rsp-border-blue-500"
                        placeholder="Sample"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Media Selection */}
      {template.headerType === 'MEDIA' && (
        <div className="rsp-space-y-6">
          <div>
            <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-2">
              Media Type
            </label>
            <div className="rsp-relative">
              <select
                value={template.mediaType || 'IMAGE'}
                onChange={(e) => setTemplate({ ...template, mediaType: e.target.value as MediaType })}
                className="rsp-w-full rsp-px-0 rsp-py-2 rsp-border-0 rsp-border-b rsp-border-gray-300 rsp-text-sm focus:rsp-outline-none focus:rsp-border-blue-500 rsp-bg-transparent rsp-appearance-none"
              >
                {mediaTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <div className="rsp-absolute rsp-inset-y-0 rsp-right-0 rsp-flex rsp-items-center rsp-px-2 rsp-pointer-events-none">
                <svg className="rsp-w-4 rsp-h-4 rsp-text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-2">
              Media
            </label>
            
            {!uploadedFile && !template.mediaUrl ? (
              <div className="rsp-space-y-4">
                {/* File Upload */}
                <div className="rsp-relative">
                  <input
                    type="file"
                    accept={getAcceptedFileTypes()}
                    onChange={handleFileUpload}
                    className="rsp-hidden"
                    id="media-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="media-upload"
                    className={`rsp-w-full rsp-px-4 rsp-py-3 rsp-border-2 rsp-border-dashed rsp-border-gray-300 rsp-rounded-md rsp-flex rsp-flex-col rsp-items-center rsp-justify-center rsp-cursor-pointer rsp-transition-colors hover:rsp-border-gray-400 hover:rsp-bg-gray-50 ${
                      isUploading ? 'rsp-opacity-50 rsp-cursor-not-allowed' : ''
                    }`}
                  >
                    <Upload className="rsp-w-6 rsp-h-6 rsp-text-gray-400 rsp-mb-2" />
                    <span className="rsp-text-sm rsp-text-gray-600">
                      {isUploading ? 'Uploading...' : `Upload ${template.mediaType?.toLowerCase() || 'file'}`}
                    </span>
                    <span className="rsp-text-xs rsp-text-gray-400 rsp-mt-1">
                      {template.mediaType === 'IMAGE' && 'PNG, JPG, GIF up to 5MB'}
                      {template.mediaType === 'VIDEO' && 'MP4, MOV up to 16MB'}
                      {template.mediaType === 'DOCUMENT' && 'PDF, DOC, TXT up to 100MB'}
                    </span>
                  </label>
                </div>

                {/* OR divider */}
                <div className="rsp-flex rsp-items-center">
                  <div className="rsp-flex-1 rsp-border-t rsp-border-gray-300"></div>
                  <span className="rsp-px-3 rsp-text-sm rsp-text-gray-500">OR</span>
                  <div className="rsp-flex-1 rsp-border-t rsp-border-gray-300"></div>
                </div>

                {/* URL Input */}
                <div className="rsp-relative">
                  <input
                    type="url"
                    value={template.mediaUrl || ''}
                    onChange={(e) => setTemplate({ ...template, mediaUrl: e.target.value })}
                    className="rsp-w-full rsp-px-0 rsp-py-2 rsp-border-0 rsp-border-b rsp-border-gray-300 rsp-text-sm focus:rsp-outline-none focus:rsp-border-blue-500 rsp-bg-transparent"
                    placeholder={`Enter ${template.mediaType?.toLowerCase()} URL`}
                  />
                </div>
              </div>
            ) : (
              /* Show uploaded file or URL */
              <div className="rsp-space-y-3">
                <div className="rsp-flex rsp-items-center rsp-justify-between rsp-p-3 rsp-bg-gray-50 rsp-border rsp-border-gray-200 rsp-rounded-md">
                  <div className="rsp-flex rsp-items-center rsp-space-x-3">
                    {template.mediaType === 'IMAGE' && template.mediaUrl && (
                      <img 
                        src={template.mediaUrl} 
                        alt="Preview" 
                        className="rsp-w-12 rsp-h-12 rsp-object-cover rsp-rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <p className="rsp-text-sm rsp-font-medium rsp-text-gray-900">
                        {uploadedFile ? uploadedFile.name : 'Media URL'}
                      </p>
                      <p className="rsp-text-xs rsp-text-gray-500">
                        {uploadedFile 
                          ? `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB`
                          : template.mediaUrl
                        }
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeUploadedFile}
                    className="rsp-p-1 rsp-text-gray-400 hover:rsp-text-red-500 rsp-transition-colors"
                  >
                    <X className="rsp-w-4 rsp-h-4" />
                  </button>
                </div>

                {/* Option to change */}
                <button
                  onClick={() => {
                    removeUploadedFile();
                  }}
                  className="rsp-text-sm rsp-text-blue-600 hover:rsp-text-blue-700"
                >
                  Change media
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}