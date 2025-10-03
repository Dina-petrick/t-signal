import React from 'react';
import { Upload, X, Type, AlertCircle, FileVideo, FileText } from 'lucide-react';
import { Template, HeaderType, MediaType } from '../../types';

type Props = {
  template: Template;
  setTemplate: React.Dispatch<React.SetStateAction<Template>>;
  /**
   * Handles the file upload process.
   * @param file The file to upload.
   * @returns A promise that resolves to the URL or handle of the uploaded file.
   */
  onFileUpload: (file: File) => Promise<string>;
};

const headerTypes: { value: HeaderType; label: string }[] = [
  { value: 'NONE', label: 'None' },
  { value: 'TEXT', label: 'Text' },
  { value: 'MEDIA', label: 'Media' }
];

const mediaTypes: { value: MediaType; label: string }[] = [
  { value: 'IMAGE', label: 'Image' },
  { value: 'VIDEO', label: 'Video' },
  { value: 'DOCUMENT', label: 'Document' }
];

// File size constants in bytes
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_VIDEO_SIZE = 16 * 1024 * 1024; // 16 MB
const MAX_DOCUMENT_SIZE = 100 * 1024 * 1024; // 100 MB

// Allowed file extensions
const ALLOWED_IMAGE_TYPES = ['jpg', 'jpeg', 'png'];
const ALLOWED_VIDEO_TYPES = ['mp4', '3gpp'];
const ALLOWED_DOCUMENT_TYPES = ['pdf', 'docx', 'xlsx', 'pptx', 'txt'];

export default function HeaderSection({ template, setTemplate, onFileUpload }: Props) {
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [headerTextareaRef, setHeaderTextareaRef] = React.useState<HTMLInputElement | null>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  const getLastVariableNumberInTemplate = (): number => {
    const allText = [
      template.headerText || '',
      template.body || '',
      ...template.buttons
        .filter(b => b.type === 'URL' && b.urlType === 'dynamic')
        .map(b => b.value || '')
    ].join(' ');

    const matches = allText.match(/{{\d+}}/g);
    if (!matches) return 0;
    
    const numbers = matches.map(match => {
      const num = match.match(/{{(\d+)}}/);
      return num ? parseInt(num[1], 10) : 0;
    });
    
    return numbers.length > 0 ? Math.max(...numbers) : 0;
  };

  const addHeaderVariable = () => {
    const lastNumber = getLastVariableNumberInTemplate();
    const nextNumber = lastNumber + 1;
    const variable = `{{${nextNumber}}}`;

    if (headerTextareaRef && template.headerText.length + variable.length <= 60) {
      const cursorPosition = headerTextareaRef.selectionStart || template.headerText.length;
      const beforeCursor = template.headerText.substring(0, cursorPosition);
      const afterCursor = template.headerText.substring(cursorPosition);
      const newHeaderText = beforeCursor + variable + afterCursor;
      
      setTemplate({ ...template, headerText: newHeaderText });
      
      setTimeout(() => {
        if (headerTextareaRef) {
          const newPosition = cursorPosition + variable.length;
          headerTextareaRef.setSelectionRange(newPosition, newPosition);
          headerTextareaRef.focus();
        }
      }, 0);
    }
  };

  const handleHeaderTypeChange = (headerType: HeaderType) => {
    setTemplate(prev => ({
      ...prev,
      headerType,
      headerText: headerType === 'TEXT' ? prev.headerText : '',
      mediaType: headerType === 'MEDIA' ? (prev.mediaType || 'IMAGE') : undefined,
      mediaUrl: headerType === 'MEDIA' ? prev.mediaUrl : undefined
    }));
    
    if (headerType !== 'MEDIA') {
      setUploadedFile(null);
      setUploadError(null);
    }
  };

  const getExtension = (filename: string): string => {
    return filename.split('?')[0].split('.').pop()?.toLowerCase() || '';
  };

  const validateFile = (file: File, mediaType: MediaType): string | null => {
    const extension = getExtension(file.name);
    
    switch (mediaType) {
      case 'IMAGE':
        if (!ALLOWED_IMAGE_TYPES.includes(extension)) return `Invalid format. Only JPG, JPEG, PNG are allowed.`;
        if (file.size > MAX_IMAGE_SIZE) return `File is too large. Max size is 5 MB.`;
        break;
      case 'VIDEO':
        if (!ALLOWED_VIDEO_TYPES.includes(extension)) return `Invalid format. Only MP4, 3GPP are allowed.`;
        if (file.size > MAX_VIDEO_SIZE) return `File is too large. Max size is 16 MB.`;
        break;
      case 'DOCUMENT':
        if (!ALLOWED_DOCUMENT_TYPES.includes(extension)) return `Invalid format. Allowed types: PDF, DOCX, XLSX, PPTX, TXT.`;
        if (file.size > MAX_DOCUMENT_SIZE) return `File is too large. Max size is 100 MB.`;
        break;
      default:
        return 'Invalid media type.';
    }
    return null;
  };

  const validateUrl = (url: string, mediaType: MediaType): string | null => {
    if (!url) return null; // Don't validate empty URLs
    const extension = getExtension(url);

    switch (mediaType) {
        case 'IMAGE':
            if (!ALLOWED_IMAGE_TYPES.includes(extension)) return `URL does not point to a valid image (JPG, JPEG, PNG).`;
            break;
        case 'VIDEO':
            if (!ALLOWED_VIDEO_TYPES.includes(extension)) return `URL does not point to a valid video (MP4, 3GPP).`;
            break;
        case 'DOCUMENT':
            if (!ALLOWED_DOCUMENT_TYPES.includes(extension)) return `URL does not point to a valid document.`;
            break;
    }
    return null;
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setTemplate({ ...template, mediaUrl: '' });
    setUploadError(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !template.mediaType) return;

    setUploadError(null);
    const validationError = validateFile(file, template.mediaType);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setIsUploading(true);
    setUploadedFile(file);

    try {
      const fileUrl = await onFileUpload(file);
      setTemplate({ ...template, mediaUrl: fileUrl });
    } catch (error) {
      console.error('File upload failed:', error);
      removeUploadedFile();
      const errorMessage = error instanceof Error ? error.message : 'File upload failed. Please try again.';
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newUrl = e.target.value;
      setUploadedFile(null); // Clear file if user types a URL
      setTemplate({ ...template, mediaUrl: newUrl });

      // Validate the URL on change
      if (template.mediaType) {
          const validationError = validateUrl(newUrl, template.mediaType);
          setUploadError(validationError);
      }
  };

  const getAcceptedFileTypes = () => {
    switch (template.mediaType) {
      case 'IMAGE': return ALLOWED_IMAGE_TYPES.map(ext => `.${ext}`).join(',');
      case 'VIDEO': return ALLOWED_VIDEO_TYPES.map(ext => `.${ext}`).join(',');
      case 'DOCUMENT': return ALLOWED_DOCUMENT_TYPES.map(ext => `.${ext}`).join(',');
      default: return '*/*';
    }
  };

  return (
    <div className="rsp-space-y-6">
      {/* Header Type Selection */}
      <div>
        <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-2">Header Type</label>
        <div className="rsp-relative">
          <select
            value={template.headerType}
            onChange={(e) => handleHeaderTypeChange(e.target.value as HeaderType)}
            className="rsp-w-full rsp-px-0 rsp-py-2 rsp-border-0 rsp-border-b rsp-border-gray-300 rsp-text-sm focus:rsp-outline-none focus:rsp-border-blue-500 rsp-bg-transparent rsp-appearance-none"
          >
            {headerTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
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
        <div className="rsp-animate-fade-in">
          <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-2">Header Text</label>
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
          </div>
          <div className="rsp-flex rsp-items-center rsp-justify-between rsp-mt-2">
            <button
              onClick={addHeaderVariable}
              className="rsp-px-2 rsp-py-1 rsp-text-xs rsp-bg-gray-100 hover:rsp-bg-gray-200 rsp-rounded rsp-text-gray-700 rsp-flex rsp-items-center rsp-gap-1"
              title="Add variable to header"
            >
              <Type className="rsp-w-3 rsp-h-3" />
              Add Variable
            </button>
            <span className="rsp-text-xs rsp-text-gray-500">{template.headerText.length}/60</span>
          </div>
          
          {(() => {
            const headerVariables = [...new Set((template.headerText.match(/\{\{(\d+)\}\}/g) || []).map(v => v.replace(/[{}]/g, '')))];
            if (headerVariables.length === 0) return null;
            return (
              <div className="rsp-mt-3">
                <p className="rsp-text-xs rsp-font-medium rsp-text-gray-600 rsp-mb-2">Sample Values</p>
                <div className="rsp-grid rsp-grid-cols-2 rsp-gap-2">
                  {headerVariables.map((variable) => (
                    <div key={`header-sample-${variable}`} className="rsp-flex rsp-items-center rsp-gap-2">
                      <label className="rsp-text-xs rsp-text-gray-500 rsp-whitespace-nowrap">{`{{${variable}}}`}:</label>
                      <input
                        type="text"
                        value={template.sampleContent?.headerVariables?.[variable] || ''}
                        onChange={(e) => {
                          const newSampleContent = {
                            ...template.sampleContent,
                            headerVariables: { ...template.sampleContent?.headerVariables, [variable]: e.target.value },
                            bodyVariables: template.sampleContent?.bodyVariables || {}
                          };
                          setTemplate({ ...template, sampleContent: newSampleContent });
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
        <div className="rsp-space-y-6 rsp-animate-fade-in">
          <div>
            <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-2">Media Type</label>
            <div className="rsp-relative">
              <select
                value={template.mediaType || 'IMAGE'}
                onChange={(e) => {
                  setTemplate(prev => ({ 
                    ...prev, 
                    mediaType: e.target.value as MediaType, 
                    mediaUrl: '' 
                  }));
                  setUploadedFile(null);
                  setUploadError(null);
                }}
                className="rsp-w-full rsp-px-0 rsp-py-2 rsp-border-0 rsp-border-b rsp-border-gray-300 rsp-text-sm focus:rsp-outline-none focus:rsp-border-blue-500 rsp-bg-transparent rsp-appearance-none"
              >
                {mediaTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <div className="rsp-absolute rsp-inset-y-0 rsp-right-0 rsp-flex rsp-items-center rsp-px-2 rsp-pointer-events-none">
                <svg className="rsp-w-4 rsp-h-4 rsp-text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rsp-space-y-4">
            <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700">Media</label>
            
            {template.mediaUrl ? (
              <div className="rsp-flex rsp-items-center rsp-justify-between rsp-p-3 rsp-bg-gray-50 rsp-border rsp-border-gray-200 rsp-rounded-md">
                <div className="rsp-flex rsp-items-center rsp-space-x-3 overflow-hidden">
                  {template.mediaType === 'IMAGE' && (
                    <img 
                      src={template.mediaUrl} 
                      alt="Preview" 
                      className="rsp-w-12 rsp-h-12 rsp-object-cover rsp-rounded" 
                      onError={(e) => { 
                        e.currentTarget.style.display = 'none'; 
                        if (!uploadError) setUploadError("Could not load image preview from URL.");
                      }}
                      onLoad={() => {
                        if (uploadError?.includes("Could not load")) setUploadError(null);
                      }}
                    />
                  )}
                  {template.mediaType === 'VIDEO' && (
                    <div className="rsp-w-12 rsp-h-12 rsp-bg-gray-200 rsp-rounded rsp-flex rsp-items-center rsp-justify-center flex-shrink-0">
                      <FileVideo className="rsp-w-6 rsp-h-6 rsp-text-gray-500" />
                    </div>
                  )}
                  {template.mediaType === 'DOCUMENT' && (
                     <div className="rsp-w-12 rsp-h-12 rsp-bg-gray-200 rsp-rounded rsp-flex rsp-items-center rsp-justify-center flex-shrink-0">
                      <FileText className="rsp-w-6 rsp-h-6 rsp-text-gray-500" />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="rsp-text-sm rsp-font-medium rsp-text-gray-900 rsp-truncate">
                      {uploadedFile ? uploadedFile.name : template.mediaUrl}
                    </p>
                    {uploadedFile && (
                       <p className="rsp-text-xs rsp-text-gray-500">{`${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB`}</p>
                    )}
                  </div>
                </div>
                <button onClick={removeUploadedFile} className="rsp-p-1 rsp-text-gray-400 hover:rsp-text-red-500 rsp-transition-colors flex-shrink-0">
                  <X className="rsp-w-4 rsp-h-4" />
                </button>
              </div>
            ) : (
              <div>
                <input type="file" accept={getAcceptedFileTypes()} onChange={handleFileUpload} className="rsp-hidden" id="media-upload" disabled={isUploading} />
                <label
                  htmlFor="media-upload"
                  className={`rsp-w-full rsp-px-4 rsp-py-3 rsp-border-2 rsp-border-dashed rsp-border-gray-300 rsp-rounded-md rsp-flex rsp-flex-col rsp-items-center rsp-justify-center rsp-cursor-pointer rsp-transition-colors hover:rsp-border-gray-400 hover:rsp-bg-gray-50 ${
                    isUploading ? 'rsp-opacity-50 rsp-cursor-not-allowed' : ''
                  }`}
                >
                  <Upload className="rsp-w-6 rsp-h-6 rsp-text-gray-400 rsp-mb-2" />
                  <span className="rsp-text-sm rsp-text-gray-600">{isUploading ? 'Uploading...' : `Upload ${template.mediaType?.toLowerCase() || 'file'}`}</span>
                  <span className="rsp-text-xs rsp-text-gray-400 rsp-mt-1">
                    {template.mediaType === 'IMAGE' && 'JPG, PNG up to 5MB'}
                    {template.mediaType === 'VIDEO' && 'MP4, 3GPP up to 16MB'}
                    {template.mediaType === 'DOCUMENT' && 'PDF, DOCX, etc. up to 100MB'}
                  </span>
                </label>
              </div>
            )}

            {uploadError && (
              <div className="rsp-flex rsp-items-center rsp-gap-2 rsp-text-xs rsp-text-red-600">
                <AlertCircle className="rsp-w-4 rsp-h-4" />
                <span>{uploadError}</span>
              </div>
            )}

            <div className="rsp-flex rsp-items-center">
              <div className="rsp-flex-1 rsp-border-t rsp-border-gray-300"></div>
              <span className="rsp-px-3 rsp-text-sm rsp-text-gray-500">OR</span>
              <div className="rsp-flex-1 rsp-border-t rsp-border-gray-300"></div>
            </div>

            <div className="rsp-relative">
              <input
                type="url"
                value={template.mediaUrl || ''}
                onChange={handleUrlChange}
                className="rsp-w-full rsp-px-0 rsp-py-2 rsp-border-0 rsp-border-b rsp-border-gray-300 rsp-text-sm focus:rsp-outline-none focus:rsp-border-blue-500 rsp-bg-transparent"
                placeholder={`Enter ${template.mediaType?.toLowerCase()} URL`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}