import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Template } from '../types';
import { createTemplate } from '../api';
import { AlertCircle, X } from 'lucide-react';
import LANGUAGES from '../utils/language';
import Modal from './Modal';
import { TrustSignalTemplateBuilder } from './TrustSignalTemplateBuilder';
import TemplatePreview from './TemplatePreview';

const INITIAL_TEMPLATE: Template = {
  name: '',
  category: 'MARKETING',
  type: 'BASIC',
  language: 'en_US',
  enableClickTracking: false,
  headerType: 'NONE',
  headerText: '',
  body: '',
  footer: '',
  buttons: []
};

export function TemplateBuilder() {
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template>(INITIAL_TEMPLATE);
  const [showPreview, setShowPreview] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; templateName?: string; templateId?: string }>({
    isOpen: false
  });
  const [saveModal, setSaveModal] = useState<{ isOpen: boolean }>({
    isOpen: false
  });

  const hasVariables = (text: string) => {
    return /\{\{(header_\d+|body_\d+|\d+)\}\}/.test(text);
  };

  const hasDynamicUrlButton = () => {
    return template.buttons.some(button => button.type === 'URL' && button.urlType === 'dynamic');
  };


  const isCreateButtonEnabled = () => {
    // Basic validation
    if (!template.name || !template.body) return false;
    
    // Extract all variables that require sample values
    const bodyVariables = extractVariables(template.body);
    const headerVariables = extractVariables(template.headerText);
    const urlPlaceholders = getUrlPlaceholders();

    // Check if all header variables have non-empty sample values
    const headerSamplesFilled = headerVariables.every(variable => 
      !!template.sampleContent?.headerVariables?.[variable]?.trim()
    );
    
    // Check if all body variables have non-empty sample values
    const bodySamplesFilled = bodyVariables.every(variable => 
      !!template.sampleContent?.bodyVariables?.[variable]?.trim()
    );
    
    // Check if all URL variables have a corresponding, non-empty sample value in the BODY variables.
    // This aligns with the API requirement to use body_text samples for URL placeholders.
    const urlSamplesFilled = urlPlaceholders.every(variable => 
      !!template.sampleContent?.bodyVariables?.[variable]?.trim()
    );
    
    return headerSamplesFilled && bodySamplesFilled && urlSamplesFilled;
  };

  const extractVariables = (text: string) => {
    if (!text) return [];
    const matches = text.match(/\{\{(\d+)\}\}/g) || [];
    return [...new Set(matches.map(match => match.replace(/[{}]/g, '')))];
  };

  const getUrlPlaceholders = () => {
    const dynamicUrlButton = template.buttons.find(
      button => button.type === 'URL' && button.urlType === 'dynamic'
    );
    if (!dynamicUrlButton?.value) return [];
    
    const matches = dynamicUrlButton.value.match(/\{\{(\d+)\}\}/g) || [];
    return [...new Set(matches.map(match => match.replace(/[{}]/g, '')))];
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (!template.name || !template.body) {
        throw new Error('Template name and body are required');
      }

      // Get API key from localStorage
      const savedAccount = localStorage.getItem('account');
      const account = savedAccount ? JSON.parse(savedAccount) : { apiKey: '' };
      
      if (!account.apiKey) {
        throw new Error('Please set your API key in the dashboard first');
      }

      const response = await createTemplate(account, template);

      if (response.status === 'error') {
        throw new Error(response.message);
      }

      setSuccessModal({
        isOpen: true,
        templateName: response.data?.details[0].template_name,
        templateId: response.data?.details[0].template_id,
        // @ts-ignore
        template: response.data?.template
      });
      
      setTemplate(INITIAL_TEMPLATE);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the template');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSampleContentUpdate = (sampleContent: Template['sampleContent']) => {
    setTemplate(prev => ({
      ...prev,
      sampleContent
    }));
  };

  const handleSuccessModalClose = () => {
    setSuccessModal({ isOpen: false });
    navigate('/');
  };

  return (
    <div className="rsp-min-h-screen rsp-bg-white">
      <div className="rsp-max-w-[1200px] rsp-mx-auto rsp-px-6 rsp-h-full">
        {/* Header */}
        <div className="rsp-py-6 rsp-border-b rsp-border-gray-200">
          <div className="rsp-flex rsp-items-center rsp-justify-between">
            <h1 className="rsp-text-2xl rsp-font-semibold rsp-text-[#0043ff]">Add Template</h1>
            <div className="rsp-flex rsp-items-center rsp-gap-3">
              <button
                onClick={() => navigate('/')}
                className="rsp-px-4 rsp-py-2 rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-bg-white rsp-border rsp-border-gray-300 rsp-rounded-md hover:rsp-bg-gray-50 rsp-transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`rsp-flex rsp-items-center rsp-gap-2 rsp-px-4 rsp-py-2 rsp-rounded-md rsp-text-sm rsp-font-medium rsp-transition-colors
                  ${showPreview
                    ? 'rsp-bg-blue-100 rsp-text-blue-700 rsp-border rsp-border-blue-200'
                    : 'rsp-bg-gray-100 rsp-text-gray-700 rsp-border rsp-border-gray-200'
                  }`}
              >
                <svg className="rsp-w-4 rsp-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>
          </div>
        </div>

        <div className={`rsp-py-8 ${showPreview ? 'rsp-grid xl:rsp-grid-cols-[1fr,400px] rsp-gap-8' : ''}`}>
          {/* Left Column - Form */}
          <div className={`rsp-space-y-8 ${showPreview ? '' : 'rsp-max-w-4xl rsp-mx-auto'}`}>
            {/* Basic Template Info */}
            <div className="rsp-space-y-6">
              {/* Template Name */}
              <div>
                <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-2">
                  Template Name <span className="rsp-text-red-500">*</span>
                </label>
                <div className="rsp-relative">
                  <input
                    type="text"
                    value={template.name}
                    onChange={(e) => setTemplate({ ...template, name: e.target.value.replace(/\s/g, '_').replace(/[^a-zA-Z0-9_]/g, '').replace(/_+/g, '_') })}
                    className="rsp-w-full rsp-px-0 rsp-py-2 rsp-border-0 rsp-border-b rsp-border-gray-300 rsp-text-sm focus:rsp-outline-none focus:rsp-border-blue-500 rsp-bg-transparent"
                    placeholder="Template name cannot Have capital letters and space"
                  />
                  <div className="rsp-absolute rsp-bottom-0 rsp-left-0 rsp-w-4 rsp-h-0.5 rsp-bg-red-500"></div>
                </div>
                <p className="rsp-text-xs rsp-text-gray-500 rsp-mt-1">Template name cannot Have capital letters and space</p>
              </div>

              {/* Two Column Layout */}
              <div className="rsp-grid rsp-grid-cols-2 rsp-gap-6">
                {/* Category */}
                <div>
                  <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-2">
                    Category
                  </label>
                  <div className="rsp-relative">
                    <select
                      value={template.category}
                      onChange={(e) => setTemplate({ ...template, category: e.target.value as Template['category'] })}
                      className="rsp-w-full rsp-px-0 rsp-py-2 rsp-border-0 rsp-border-b rsp-border-gray-300 rsp-text-sm focus:rsp-outline-none focus:rsp-border-blue-500 rsp-bg-transparent rsp-appearance-none"
                    >
                      <option value="MARKETING">Marketing</option>
                      <option value="UTILITY">Utility</option>
                    </select>
                    <div className="rsp-absolute rsp-inset-y-0 rsp-right-0 rsp-flex rsp-items-center rsp-px-2 rsp-pointer-events-none">
                      <svg className="rsp-w-4 rsp-h-4 rsp-text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <div className="rsp-absolute rsp-bottom-0 rsp-left-0 rsp-w-4 rsp-h-0.5 rsp-bg-red-500"></div>
                  </div>
                  <p className="rsp-text-xs rsp-text-gray-500 rsp-mt-1">Choose Marketing for promotional communication and Utility for informational messages.</p>
                </div>

                {/* Language */}
                <div>
                  <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-2">
                    Language
                  </label>
                  <div className="rsp-relative">
                    <select
                      value={template.language}
                      onChange={(e) => setTemplate({ ...template, language: e.target.value })}
                      className="rsp-w-full rsp-px-0 rsp-py-2 rsp-border-0 rsp-border-b rsp-border-gray-300 rsp-text-sm focus:rsp-outline-none focus:rsp-border-blue-500 rsp-bg-transparent rsp-appearance-none"
                    >
                      {LANGUAGES.map((language) => (
                        <option key={language.value} value={language.value}>
                          {language.label}
                        </option>
                      ))}
                    </select>
                    <div className="rsp-absolute rsp-inset-y-0 rsp-right-0 rsp-flex rsp-items-center rsp-px-2 rsp-pointer-events-none">
                      <svg className="rsp-w-4 rsp-h-4 rsp-text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <div className="rsp-absolute rsp-bottom-0 rsp-left-0 rsp-w-8 rsp-h-0.5 rsp-bg-red-500"></div>
                  </div>
                </div>
              </div>

              {/* Second Row */}
              <div className="rsp-grid rsp-grid-cols-2 rsp-gap-6">
                {/* Template Type */}
                <div>
                  <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-2">
                    Template Type
                  </label>
                  <div className="rsp-relative">
                    <select
                      value={template.type}
                      onChange={(e) => setTemplate({ ...template, type: e.target.value as Template['type'] })}
                      className="rsp-w-full rsp-px-0 rsp-py-2 rsp-border-0 rsp-border-b rsp-border-gray-300 rsp-text-sm focus:rsp-outline-none focus:rsp-border-blue-500 rsp-bg-transparent rsp-appearance-none"
                    >
                      <option value="BASIC">Basic</option>
                      <option value="CAROUSEL" disabled>Carousel</option>
                    </select>
                    <div className="rsp-absolute rsp-inset-y-0 rsp-right-0 rsp-flex rsp-items-center rsp-px-2 rsp-pointer-events-none">
                      <svg className="rsp-w-4 rsp-h-4 rsp-text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <div className="rsp-absolute rsp-bottom-0 rsp-left-0 rsp-w-4 rsp-h-0.5 rsp-bg-red-500"></div>
                  </div>
                </div>

                {/* Enable Click Tracking */}
                <div>
                  <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-2">
                    Enable click tracking
                  </label>
                  <div className="rsp-relative">
                    <select
                      value={template.enableClickTracking.toString()}
                      onChange={(e) => setTemplate({ ...template, enableClickTracking: e.target.value === 'true' })}
                      className="rsp-w-full rsp-px-0 rsp-py-2 rsp-border-0 rsp-border-b rsp-border-gray-300 rsp-text-sm focus:rsp-outline-none focus:rsp-border-blue-500 rsp-bg-transparent rsp-appearance-none"
                    >
                      <option value="false">False</option>
                      <option value="true">True</option>
                    </select>
                    <div className="rsp-absolute rsp-inset-y-0 rsp-right-0 rsp-flex rsp-items-center rsp-px-2 rsp-pointer-events-none">
                      <svg className="rsp-w-4 rsp-h-4 rsp-text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rest of the form */}
            <TrustSignalTemplateBuilder template={template} setTemplate={setTemplate} />

            {/* Submit Section */}
            <div className="rsp-pt-6 rsp-border-t rsp-border-gray-200">
              {error && (
                <div className="rsp-mb-4 rsp-flex rsp-items-start rsp-gap-3 rsp-p-4 rsp-rounded-lg rsp-bg-red-50 rsp-border-l-4 rsp-border-l-red-500 rsp-relative rsp-animate-fade-in">
                  <AlertCircle className="rsp-w-5 rsp-h-5 rsp-text-red-500 rsp-flex-shrink-0 rsp-mt-0.5" />
                  <div>
                    <h3 className="rsp-text-sm rsp-font-medium rsp-text-red-800">Error</h3>
                    <p className="rsp-mt-1 rsp-text-sm rsp-text-red-700">{error}</p>
                  </div>
                  <button 
                    onClick={() => setError(null)}
                    className="rsp-absolute rsp-top-2 rsp-right-2 rsp-p-1 hover:rsp-bg-red-100 rsp-rounded-full"
                  >
                    <X className="rsp-w-4 rsp-h-4 rsp-text-red-500" />
                  </button>
                </div>
              )}

              <div className="rsp-flex rsp-gap-4">
                <button
                  onClick={() => {
                    setSaveModal({ isOpen: true });
                  }}
                  className="rsp-flex-1 rsp-py-3 rsp-px-6 rsp-rounded-md rsp-transition-colors rsp-text-gray-700 rsp-font-medium rsp-text-sm rsp-bg-gray-100 hover:rsp-bg-gray-200 active:rsp-bg-gray-300 rsp-border rsp-border-gray-300"
                >
                  Save
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isCreateButtonEnabled()}
                  className={`rsp-flex-1 rsp-py-3 rsp-px-6 rsp-rounded-md rsp-transition-colors rsp-text-white rsp-font-medium rsp-text-sm
                    ${isSubmitting || !isCreateButtonEnabled()
                      ? 'rsp-bg-blue-400 rsp-cursor-not-allowed'
                      : 'rsp-bg-blue-600 hover:rsp-bg-blue-700 active:rsp-bg-blue-800'
                    }`}
                >
                  {isSubmitting ? 'Submitting for Approval...' : 'Submit for Approval'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          {showPreview && (
            <div>
              <div className="rsp-sticky rsp-top-4">
                <TemplatePreview template={template} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={successModal.isOpen}
        onClose={handleSuccessModalClose}
        title="Success"
      >
        <div className="rsp-space-y-4">
          <div className="rsp-text-center">
            <p className="rsp-text-green-600 rsp-font-medium rsp-mb-4">
              Template created successfully!
            </p>
          </div>
          
          {successModal.templateId && (
            <div className="rsp-bg-gray-50 rsp-p-4 rsp-rounded-lg rsp-space-y-2">
              <div className="rsp-flex rsp-justify-between">
                <span className="rsp-text-sm rsp-text-gray-600">Template Name:</span>
                <span className="rsp-text-sm rsp-font-medium">{successModal.templateName}</span>
              </div>
              <div className="rsp-flex rsp-justify-between">
                <span className="rsp-text-sm rsp-text-gray-600">Template ID:</span>
                <span className="rsp-text-sm rsp-font-medium rsp-font-mono">{successModal.templateId}</span>
              </div>
              {/* @ts-ignore */}
              {successModal.template?.meta_tid && (
                <div className="rsp-flex rsp-justify-between">
                  <span className="rsp-text-sm rsp-text-gray-600">Meta TID:</span>
                  {/* @ts-ignore */}
                  <span className="rsp-text-sm rsp-font-medium rsp-font-mono">{successModal.template.meta_tid}</span>
                </div>
              )}
              {/* @ts-ignore */}
              {successModal.template?.status && (
                <div className="rsp-flex rsp-justify-between">
                  <span className="rsp-text-sm rsp-text-gray-600">Status:</span>
                  {/* @ts-ignore */}
                  <span className={`rsp-text-sm rsp-font-medium rsp-capitalize ${
                    // @ts-ignore
                    successModal.template.status === 'pending' ? 'rsp-text-yellow-600' :
                    // @ts-ignore
                    successModal.template.status === 'approved' ? 'rsp-text-green-600' :
                    'rsp-text-red-600'
                  }`}>
                    {/* @ts-ignore */}
                    {successModal.template.status}
                  </span>
                </div>
              )}
              {/* @ts-ignore */}
              {successModal.template?.quality && (
                <div className="rsp-flex rsp-justify-between">
                  <span className="rsp-text-sm rsp-text-gray-600">Quality:</span>
                  {/* @ts-ignore */}
                  <span className="rsp-text-sm rsp-font-medium rsp-capitalize">{successModal.template.quality}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Save Modal */}
      <Modal
        isOpen={saveModal.isOpen}
        onClose={() => setSaveModal({ isOpen: false })}
        title="Template Saved"
      >
        <div className="rsp-space-y-4">
          <div className="rsp-text-center">
            <p className="rsp-text-gray-700 rsp-mb-4">
              Your template has not been submitted for approval by META. Please submit it to use the template.
            </p>
          </div>
          
          <div className="rsp-flex rsp-gap-3 rsp-justify-end">
            <button
              onClick={() => setSaveModal({ isOpen: false })}
              className="rsp-px-4 rsp-py-2 rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-bg-white rsp-border rsp-border-gray-300 rsp-rounded-md hover:rsp-bg-gray-50 rsp-transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setSaveModal({ isOpen: false });
                handleSubmit();
              }}
              className="rsp-px-4 rsp-py-2 rsp-text-sm rsp-font-medium rsp-text-white rsp-bg-blue-600 rsp-border rsp-border-transparent rsp-rounded-md hover:rsp-bg-blue-700 rsp-transition-colors"
            >
              Submit for Approval
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}

