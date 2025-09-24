import React, { useState } from 'react';
import { Template } from '../../types';
import { Plus, MessageCircle, ExternalLink, Phone, Workflow, X, Edit3 } from 'lucide-react';

type Props = {
  template: Template;
  setTemplate: React.Dispatch<React.SetStateAction<Template>>;
};

export default function ButtonsSection({ template, setTemplate }: Props) {
  const [activeForm, setActiveForm] = useState<'quick_reply' | 'url' | 'call' | 'flow' | null>(null);
  const [showSampleFields, setShowSampleFields] = useState(false);
  const [formData, setFormData] = useState({
    text: '',
    value: '',
    urlType: 'static' as 'static' | 'dynamic'
  });

  const getButtonCounts = () => {
    return {
      quickReply: template.buttons.filter(b => b.type === 'QUICK_REPLY').length,
      url: template.buttons.filter(b => b.type === 'URL').length,
      call: template.buttons.filter(b => b.type === 'CALL').length,
      flow: template.buttons.filter(b => b.type === 'FLOW').length
    };
  };

  const counts = getButtonCounts();

  const resetForm = () => {
    setFormData({ text: '', value: '', urlType: 'static' });
    setActiveForm(null);
    setShowSampleFields(false);
  };

  const addButton = (type: 'QUICK_REPLY' | 'URL' | 'CALL' | 'FLOW') => {
    if (!formData.text.trim()) return;
    
    const newButton = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      text: formData.text,
      value: type === 'QUICK_REPLY' ? '' : formData.value,
      urlType: type === 'URL' ? formData.urlType : undefined,
    };

    setTemplate({
      ...template,
      buttons: [...template.buttons, newButton],
    });

    resetForm();
  };

  const removeButton = (id: string) => {
    setTemplate({
      ...template,
      buttons: template.buttons.filter(b => b.id !== id),
    });
  };

  const updateButton = (id: string, field: string, value: string) => {
    const maxLength = field === 'text' ? 25 : field === 'value' && template.buttons.find(b => b.id === id)?.type === 'URL' ? 2000 : 20;
    
    setTemplate({
      ...template,
      buttons: template.buttons.map(b =>
        b.id === id ? { ...b, [field]: value.slice(0, maxLength) } : b
      ),
    });
  };

  const buttonTypes = [
    {
      type: 'QUICK_REPLY' as const,
      icon: MessageCircle,
      label: 'Quick Reply',
      description: 'Add quick response options',
      limit: 10,
      current: counts.quickReply,
      color: 'blue'
    },
    {
      type: 'URL' as const,
      icon: ExternalLink,
      label: 'Web URL',
      description: 'Link to websites or pages',
      limit: 2,
      current: counts.url,
      color: 'green'
    },
    {
      type: 'CALL' as const,
      icon: Phone,
      label: 'Call Button',
      description: 'Add phone number to call',
      limit: 1,
      current: counts.call,
      color: 'purple'
    },
    {
      type: 'FLOW' as const,
      icon: Workflow,
      label: 'Flow Button',
      description: 'Connect to WhatsApp Flow',
      limit: 1,
      current: counts.flow,
      color: 'orange'
    }
  ];

  return (
    <div className="rsp-space-y-6">
      {/* Header */}
      <div className="rsp-flex rsp-items-center rsp-justify-between">
        <div>
          <h3 className="rsp-text-lg rsp-font-semibold rsp-text-gray-900">Interactive Buttons</h3>
          <p className="rsp-text-sm rsp-text-gray-500 rsp-mt-1">Add buttons to make your message interactive</p>
        </div>
        <div className="rsp-text-sm rsp-text-gray-500">
          {template.buttons.length}/13 buttons
        </div>
      </div>

      {/* Button Type Cards */}
      {!activeForm && (
        <div className="rsp-grid rsp-grid-cols-1 md:rsp-grid-cols-2 rsp-gap-4">
          {buttonTypes.map((buttonType) => {
            const Icon = buttonType.icon;
            const isDisabled = buttonType.current >= buttonType.limit;

            return (
              <button
                key={buttonType.type}
                onClick={() => !isDisabled && setActiveForm(buttonType.type)}
                disabled={isDisabled}
                className={`rsp-p-4 rsp-border-2 rsp-rounded-xl rsp-text-left rsp-transition-all rsp-duration-200 ${
                  isDisabled
                    ? 'rsp-border-gray-200 rsp-bg-gray-50 rsp-text-gray-400 rsp-cursor-not-allowed rsp-opacity-60'
                    : `rsp-cursor-pointer rsp-transform rsp-shadow-sm hover:rsp-shadow-md`
                }`}
              >
                <div className="rsp-flex rsp-items-start rsp-justify-between">
                  <div className="rsp-flex rsp-items-center rsp-gap-3">
                    <div className={`rsp-p-2 rsp-rounded-lg ${
                      isDisabled ? 'rsp-bg-gray-200' : 'rsp-bg-white rsp-shadow-sm'
                    }`}>
                      <Icon className="rsp-w-5 rsp-h-5" />
                    </div>
                    <div>
                      <h4 className="rsp-font-semibold rsp-text-sm">{buttonType.label}</h4>
                      <p className="rsp-text-xs rsp-opacity-80 rsp-mt-1">{buttonType.description}</p>
                    </div>
                  </div>
                  <div className="rsp-flex rsp-items-center rsp-gap-2">
                    <span className="rsp-text-xs rsp-font-medium rsp-px-2 rsp-py-1 rsp-rounded-full rsp-bg-white rsp-bg-opacity-70">
                      {buttonType.current}/{buttonType.limit}
                    </span>
                    {!isDisabled && <Plus className="rsp-w-4 rsp-h-4" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Active Form */}
      {activeForm && (
        <div className="rsp-bg-gradient-to-br rsp-from-gray-50 rsp-to-gray-100 rsp-border rsp-border-gray-200 rsp-rounded-xl rsp-p-6 rsp-shadow-sm">
          <div className="rsp-flex rsp-items-center rsp-justify-between rsp-mb-4">
            <h4 className="rsp-text-lg rsp-font-semibold rsp-text-gray-900">
              Add {buttonTypes.find(bt => bt.type === activeForm)?.label}
            </h4>
            <button
              onClick={resetForm}
              className="rsp-p-2 rsp-text-gray-400 hover:rsp-text-gray-600 hover:rsp-bg-white rsp-rounded-lg rsp-transition-colors"
            >
              <X className="rsp-w-5 rsp-h-5" />
            </button>
          </div>

          <div className="rsp-space-y-4">
            {/* Button Text */}
            <div>
              <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-2">
                Button Text
              </label>
              <div className="rsp-relative">
                <input
                  type="text"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value.slice(0, 25) })}
                  className="rsp-w-full rsp-px-4 rsp-py-3 rsp-border rsp-border-gray-300 rsp-rounded-lg rsp-bg-white rsp-text-sm focus:rsp-outline-none focus:rsp-ring-2 focus:rsp-ring-blue-500 focus:rsp-border-transparent rsp-shadow-sm"
                  placeholder="Enter button text (max 25 characters)"
                  maxLength={25}
                />
                <span className="rsp-absolute rsp-right-3 rsp-top-1/2 rsp-transform -rsp-translate-y-1/2 rsp-text-xs rsp-text-gray-400">
                  {formData.text.length}/25
                </span>
              </div>
            </div>

            {/* Button Value (for non-quick-reply buttons) */}
            {activeForm !== 'QUICK_REPLY' && (
              <div>
                <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-2">
                  {activeForm === 'URL' ? 'Website URL' : 
                   activeForm === 'CALL' ? 'Phone Number' : 
                   'Flow ID'}
                </label>
                
                {activeForm === 'URL' && (
                  <div className="rsp-mb-3">
                    <div className="rsp-flex rsp-gap-4">
                      <label className="rsp-flex rsp-items-center rsp-cursor-pointer">
                        <input
                          type="radio"
                          checked={formData.urlType === 'static'}
                          onChange={() => setFormData({ ...formData, urlType: 'static' })}
                          className="rsp-mr-2 rsp-text-blue-600"
                        />
                        <span className="rsp-text-sm rsp-text-gray-700">Static URL</span>
                      </label>
                      <label className="rsp-flex rsp-items-center rsp-cursor-pointer">
                        <input
                          type="radio"
                          checked={formData.urlType === 'dynamic'}
                          onChange={() => setFormData({ ...formData, urlType: 'dynamic' })}
                          className="rsp-mr-2 rsp-text-blue-600"
                        />
                        <span className="rsp-text-sm rsp-text-gray-700">Dynamic URL</span>
                      </label>
                    </div>
                    {formData.urlType === 'dynamic' && (
                      <div className="rsp-mt-3 rsp-p-3 rsp-bg-blue-50 rsp-rounded-lg rsp-border rsp-border-blue-200">
                        <h4 className="rsp-text-sm rsp-font-medium rsp-text-blue-800 rsp-mb-2">Dynamic URL Guidelines:</h4>
                        <ul className="rsp-text-xs rsp-text-blue-700 rsp-space-y-1">
                          <li>• Use placeholders like: https://example.com/order/&#123;&#123;1&#125;&#125;</li>
                          <li>• Maximum 3 placeholders per URL (&#123;&#123;1&#125;&#125;, &#123;&#123;2&#125;&#125;, &#123;&#123;3&#125;&#125;)</li>
                          <li>• Only HTTPS URLs are allowed</li>
                          <li>• WhatsApp verifies only the domain</li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}


                <div className="rsp-relative">
                  <input
                    type={activeForm === 'CALL' ? 'tel' : activeForm === 'URL' ? 'url' : 'text'}
                    value={formData.value}
                    onChange={(e) => {
                      const maxLength = activeForm === 'URL' ? 2000 : 20;
                      setFormData({ ...formData, value: e.target.value.slice(0, maxLength) });
                    }}
                    className="rsp-w-full rsp-px-4 rsp-py-3 rsp-border rsp-border-gray-300 rsp-rounded-lg rsp-bg-white rsp-text-sm focus:rsp-outline-none focus:rsp-ring-2 focus:rsp-ring-blue-500 focus:rsp-border-transparent rsp-shadow-sm"
                    placeholder={
                      activeForm === 'URL' 
                        ? (formData.urlType === 'dynamic' 
                            ? 'https://example.com/order/{{1}}?user={{2}}'
                            : 'https://example.com'
                          )
                        :
                      activeForm === 'CALL' ? '+1234567890' :
                      'Flow ID'
                    }
                    maxLength={activeForm === 'URL' ? 2000 : 20}
                  />
                  <span className="rsp-absolute rsp-right-3 rsp-top-1/2 rsp-transform -rsp-translate-y-1/2 rsp-text-xs rsp-text-gray-400">
                    {formData.value.length}/{activeForm === 'URL' ? 2000 : 20}
                  </span>
                </div>

                {/* Combined Button and Sample Values for Dynamic URL */}
                {activeForm === 'URL' && formData.urlType === 'dynamic' && (
                  <div className="rsp-mt-3">
                    <div className="rsp-flex rsp-items-center rsp-gap-2 rsp-mb-2">
                      <button
                        type="button"
                        onClick={() => {
                          const currentVarCount = (formData.value.match(/\{\{(\d+)\}\}/g) || []).length;
                          if (currentVarCount >= 3) return;

                          const lastNum = (formData.value.match(/{{\d+}}/g) || [])
                            .map(m => parseInt(m.replace(/[{}]/g, ""), 10))
                            .reduce((a, b) => Math.max(a, b), 0);
                          const nextNum = lastNum + 1;
                          const newUrl = formData.value + `{{${nextNum}}}`;
                          setFormData({ ...formData, value: newUrl });
                          setShowSampleFields(true); // Show sample fields on adding a variable
                        }}
                        disabled={(formData.value.match(/\{\{(\d+)\}\}/g) || []).length >= 3}
                        className="rsp-px-2 rsp-py-2 rsp-text-xs rsp-bg-gray-300 hover:rsp-bg-gray-200 rsp-rounded rsp-text-gray-700 disabled:rsp-bg-gray-200 disabled:rsp-text-gray-500"
                      >
                        + Add Variable
                      </button>
                    </div>
                     {(formData.value.match(/\{\{(\d+)\}\}/g) || []).length >= 3 && (
                        <p className="rsp-text-xs rsp-text-gray-500 rsp-mt-1">
                          Maximum 3 variables allowed.
                        </p>
                      )}
                    
                    {/* Sample Input Fields */}
                    {showSampleFields && (
                      <div className="rsp-mt-4 rsp-p-4 rsp-bg-gray-50 rsp-rounded-lg rsp-border">
                        <h4 className="rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-3">Sample Values for URL Variables</h4>
                        <div className="rsp-space-y-3">
                          {(() => {
                            const matches = formData.value.match(/\{\{(\d+)\}\}/g) || [];
                            const placeholders = [...new Set(matches.map(match => match.replace(/[{}]/g, '')))];
                            return placeholders.map((placeholder) => (
                              <div key={`sample-${placeholder}`}>
                                <label className="rsp-block rsp-text-sm rsp-text-gray-600 rsp-mb-1">
                                  Variable &#123;&#123;{placeholder}&#125;&#125;
                                </label>
                                <input
                                  type="text"
                                  value={template.sampleContent?.buttonVariables?.[placeholder] || ''}
                                  onChange={(e) => {
                                    const newSampleContent = {
                                      ...template.sampleContent,
                                      headerVariables: template.sampleContent?.headerVariables || {},
                                      bodyVariables: template.sampleContent?.bodyVariables || {},
                                      buttonVariables: {
                                        ...template.sampleContent?.buttonVariables,
                                        [placeholder]: e.target.value
                                      }
                                    };
                                    setTemplate({
                                      ...template,
                                      sampleContent: newSampleContent
                                    });
                                  }}
                                  className="rsp-w-full rsp-px-3 rsp-py-2 rsp-border rsp-border-gray-300 rsp-rounded-md rsp-text-sm focus:rsp-outline-none focus:rsp-ring-1 focus:rsp-ring-blue-500 focus:rsp-border-blue-500"
                                  placeholder={`Sample value (e.g., ${placeholder === '1' ? 'order123' : placeholder === '2' ? 'user456' : 'value' + placeholder})`}
                                />
                              </div>
                            ));
                          })()}
                        </div>
                        
                        {/* Live Preview */}
                        <div className="rsp-mt-4 rsp-p-3 rsp-bg-white rsp-rounded-lg rsp-border">
                          <p className="rsp-text-xs rsp-font-medium rsp-text-gray-700 rsp-mb-1">Preview URL:</p>
                          <p className="rsp-text-xs rsp-text-gray-600 rsp-font-mono rsp-break-all">
                            {formData.value.replace(/\{\{(\d+)\}\}/g, (match, number) => 
                              template.sampleContent?.buttonVariables?.[number] || `[${match}]`
                            )}
                          </p>
                        </div>
                        
                        {/* Close Button */}
                        <div className="rsp-mt-3 rsp-flex rsp-justify-end">
                          <button
                            type="button"
                            onClick={() => setShowSampleFields(false)}
                            className="rsp-px-3 rsp-py-1 rsp-text-xs rsp-text-gray-500 hover:rsp-text-gray-700"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="rsp-flex rsp-gap-3 rsp-pt-2">
              <button
                onClick={() => addButton(activeForm!)}
                disabled={!formData.text.trim() || (activeForm !== 'QUICK_REPLY' && !formData.value.trim())}
                className="rsp-flex-1 rsp-bg-blue-600 rsp-text-white rsp-py-3 rsp-px-4 rsp-rounded-lg rsp-font-medium rsp-text-sm rsp-transition-colors hover:rsp-bg-blue-700 disabled:rsp-opacity-50 disabled:rsp-cursor-not-allowed rsp-shadow-sm"
              >
                Add Button
              </button>
              <button
                onClick={resetForm}
                className="rsp-px-4 rsp-py-3 rsp-text-gray-600 rsp-bg-white rsp-border rsp-border-gray-300 rsp-rounded-lg rsp-font-medium rsp-text-sm rsp-transition-colors hover:rsp-bg-gray-50 rsp-shadow-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Buttons List */}
      {template.buttons.length > 0 && (
        <div className="rsp-space-y-4">
          <h4 className="rsp-text-md rsp-font-semibold rsp-text-gray-900">Added Buttons</h4>
          <div className="rsp-space-y-3">
            {template.buttons.map((button) => {
              const buttonType = buttonTypes.find(bt => bt.type === button.type);
              const Icon = buttonType?.icon || MessageCircle;
              
              return (
                <div key={button.id} className="rsp-bg-white rsp-border rsp-border-gray-200 rsp-rounded-lg rsp-p-4 rsp-shadow-sm">
                  <div className="rsp-flex rsp-items-start rsp-gap-3">
                    <div className="rsp-p-2 rsp-bg-gray-50 rsp-rounded-lg">
                      <Icon className="rsp-w-4 rsp-h-4 rsp-text-gray-600" />
                    </div>
                    
                    <div className="rsp-flex-1 rsp-space-y-3">
                      <div className="rsp-flex rsp-items-center rsp-justify-between">
                        <span className="rsp-text-xs rsp-font-medium rsp-text-gray-500 rsp-uppercase rsp-tracking-wider">
                          {button.type.replace('_', ' ')}
                        </span>
                        <button
                          onClick={() => removeButton(button.id)}
                          className="rsp-p-1 rsp-text-red-400 hover:rsp-text-red-600 hover:rsp-bg-red-50 rsp-rounded rsp-transition-colors"
                        >
                          <X className="rsp-w-4 rsp-h-4" />
                        </button>
                      </div>
                      
                      <div className="rsp-grid rsp-grid-cols-1 rsp-gap-3">
                        <div>
                          <label className="rsp-block rsp-text-xs rsp-font-medium rsp-text-gray-600 rsp-mb-1">
                            Button Text
                          </label>
                          <div className="rsp-relative">
                            <input
                              type="text"
                              value={button.text}
                              onChange={(e) => updateButton(button.id, 'text', e.target.value)}
                              maxLength={25}
                              className="rsp-w-full rsp-px-3 rsp-py-2 rsp-border rsp-border-gray-300 rsp-rounded-md rsp-text-sm focus:rsp-outline-none focus:rsp-ring-1 focus:rsp-ring-blue-500 focus:rsp-border-blue-500"
                            />
                            <span className="rsp-absolute rsp-right-2 rsp-top-1/2 rsp-transform -rsp-translate-y-1/2 rsp-text-xs rsp-text-gray-400">
                              {button.text.length}/25
                            </span>
                          </div>
                        </div>
                        
                        {button.type !== 'QUICK_REPLY' && (
                          <div>
                            <label className="rsp-block rsp-text-xs rsp-font-medium rsp-text-gray-600 rsp-mb-1">
                              {button.type === 'URL' ? 'Website URL' : 
                               button.type === 'CALL' ? 'Phone Number' : 
                               'Flow ID'}
                            </label>
                            <div className="rsp-relative">
                              <input
                                type={button.type === 'CALL' ? 'tel' : button.type === 'URL' ? 'url' : 'text'}
                                value={button.value || ''}
                                onChange={(e) => updateButton(button.id, 'value', e.target.value)}
                                maxLength={button.type === 'URL' ? 2000 : 20}
                                className="rsp-w-full rsp-px-3 rsp-py-2 rsp-border rsp-border-gray-300 rsp-rounded-md rsp-text-sm focus:rsp-outline-none focus:rsp-ring-1 focus:rsp-ring-blue-500 focus:rsp-border-blue-500"
                              />
                              <span className="rsp-absolute rsp-right-2 rsp-top-1/2 rsp-transform -rsp-translate-y-1/2 rsp-text-xs rsp-text-gray-400">
                                {(button.value || '').length}/{button.type === 'URL' ? 2000 : 20}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {template.buttons.length === 0 && !activeForm && (
        <div className="rsp-text-center rsp-py-12 rsp-bg-gray-50 rsp-rounded-xl rsp-border-2 rsp-border-dashed rsp-border-gray-300">
          <div className="rsp-w-16 rsp-h-16 rsp-bg-white rsp-rounded-full rsp-flex rsp-items-center rsp-justify-center rsp-mx-auto rsp-mb-4 rsp-shadow-sm">
            <MessageCircle className="rsp-w-8 rsp-h-8 rsp-text-gray-400" />
          </div>
          <h3 className="rsp-text-lg rsp-font-medium rsp-text-gray-900 rsp-mb-2">No buttons added yet</h3>
          <p className="rsp-text-gray-500 rsp-text-sm rsp-mb-4">
            Add interactive buttons to make your message more engaging
          </p>
          <p className="rsp-text-xs rsp-text-gray-400">
            Choose from Quick Reply, Web URL, Call, or Flow buttons above
          </p>
        </div>
      )}
    </div>
  );
}

