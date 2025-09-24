import { useState } from 'react';
import { Template } from '../types';
import ButtonList from './buttons/ButtonList';

type Props = {
  template: Template;
};

export default function TemplatePreview({ template }: Props) {
  const [showButtonList, setShowButtonList] = useState(false);

  const renderText = (text: string) => {
    if (!text) return '';
    
    // For header text, use headerVariables
    if (text === template.headerText) {
      return text.replace(/\{\{(\d+)\}\}/g, (match, variable) => {
        const sampleValue = template.sampleContent?.headerVariables?.[variable];
        return sampleValue || `[Variable ${variable}]`;
      });
    }
    
    // For body text, use bodyVariables
    return text.replace(/\{\{(\d+)\}\}/g, (match, variable) => {
      const sampleValue = template.sampleContent?.bodyVariables?.[variable];
      return sampleValue || `[Variable ${variable}]`;
    });
  };

  const hasContent = template.headerText || template.body || template.footer || template.buttons.length > 0;

  return (
    <div className="rsp-bg-white rsp-rounded-lg rsp-shadow-sm rsp-border rsp-border-gray-200">
      <div className="rsp-p-4 rsp-border-b rsp-border-gray-200">
        <h3 className="rsp-text-lg rsp-font-semibold rsp-text-gray-900">Preview</h3>
        <p className="rsp-text-sm rsp-text-gray-500">See how your template will look</p>
      </div>
      
      <div className="rsp-p-6 rsp-flex rsp-justify-center">
        {/* iPhone Container */}
        <div className="rsp-relative">
          {/* iPhone Frame */}
          <div className="rsp-w-[280px] rsp-h-[580px] rsp-bg-gradient-to-b rsp-from-[#1a1a1a] rsp-via-[#2d2d2f] rsp-to-[#000000] rsp-rounded-[35px] rsp-p-[2px] rsp-relative rsp-shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)] rsp-border-[1px] rsp-border-[#404040]">
            
            {/* Side Buttons */}
            <div className="rsp-absolute rsp-right-[-2px] rsp-top-[120px] rsp-w-[2px] rsp-h-[50px] rsp-bg-gradient-to-b rsp-from-[#404040] rsp-to-[#1a1a1a] rsp-rounded-l-[1px] rsp-shadow-md"></div>
            <div className="rsp-absolute rsp-left-[-2px] rsp-top-[100px] rsp-w-[2px] rsp-h-[25px] rsp-bg-gradient-to-b rsp-from-[#404040] rsp-to-[#1a1a1a] rsp-rounded-r-[1px] rsp-shadow-sm"></div>
            <div className="rsp-absolute rsp-left-[-2px] rsp-top-[135px] rsp-w-[2px] rsp-h-[40px] rsp-bg-gradient-to-b rsp-from-[#404040] rsp-to-[#1a1a1a] rsp-rounded-r-[1px] rsp-shadow-sm"></div>
            <div className="rsp-absolute rsp-left-[-2px] rsp-top-[70px] rsp-w-[2px] rsp-h-[20px] rsp-bg-gradient-to-b rsp-from-[#ff8c42] rsp-to-[#ff6b35] rsp-rounded-r-[1px] rsp-shadow-md"></div>
            
            {/* Screen */}
            <div className="rsp-w-full rsp-h-full rsp-bg-black rsp-rounded-[33px] rsp-overflow-hidden rsp-relative rsp-shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)]">
              
              {/* Dynamic Island */}
              <div className="rsp-absolute rsp-top-[14px] rsp-left-1/2 rsp-transform -rsp-translate-x-1/2 rsp-w-[70px] rsp-h-[18px] rsp-bg-gradient-to-b rsp-from-[#0a0a0a] rsp-to-[#000000] rsp-rounded-[9px] rsp-z-20 rsp-shadow-[0_1px_4px_rgba(0,0,0,0.6)] rsp-border rsp-border-[#1a1a1a] rsp-flex rsp-items-center rsp-justify-center">
                <div className="rsp-flex rsp-items-center rsp-justify-center rsp-gap-[8px]">
                  <div className="rsp-w-[3px] rsp-h-[3px] rsp-bg-gradient-to-br rsp-from-[#1a1a1a] rsp-to-[#000000] rsp-rounded-full rsp-shadow-inner"></div>
                  <div className="rsp-w-[2px] rsp-h-[2px] rsp-bg-gradient-to-br rsp-from-[#333] rsp-to-[#000] rsp-rounded-full"></div>
                </div>
              </div>
              
              {/* Screen Content */}
              <div className="rsp-w-full rsp-h-full rsp-bg-gradient-to-b rsp-from-white rsp-to-[#fafafa] rsp-rounded-[33px] rsp-relative rsp-overflow-hidden rsp-shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
                
                {/* Status Bar */}
                <div className="rsp-absolute rsp-top-0 rsp-left-0 rsp-right-0 rsp-h-[45px] rsp-bg-gradient-to-b rsp-from-white rsp-to-[#fafafa] rsp-flex rsp-items-center rsp-justify-between rsp-px-[30px] rsp-z-10">
                  <div className="rsp-text-[13px] rsp-font-semibold rsp-text-black rsp-tracking-tight">9:41</div>
                  <div className="rsp-flex rsp-items-center rsp-gap-[5px]">
                    <div className="rsp-flex rsp-gap-[2px] rsp-items-end">
                      <div className="rsp-w-[1.5px] rsp-h-[2px] rsp-bg-gradient-to-t rsp-from-black rsp-to-[#333] rsp-rounded-[0.5px]"></div>
                      <div className="rsp-w-[1.5px] rsp-h-[3px] rsp-bg-gradient-to-t rsp-from-black rsp-to-[#333] rsp-rounded-[0.5px]"></div>
                      <div className="rsp-w-[1.5px] rsp-h-[4px] rsp-bg-gradient-to-t rsp-from-black rsp-to-[#333] rsp-rounded-[0.5px]"></div>
                      <div className="rsp-w-[1.5px] rsp-h-[5px] rsp-bg-gradient-to-t rsp-from-black rsp-to-[#333] rsp-rounded-[0.5px]"></div>
                    </div>
                    <svg className="rsp-w-[11px] rsp-h-[8px] rsp-text-black rsp-opacity-90" viewBox="0 0 15 11" fill="currentColor"><path d="M1.5 4.5C3.5 2.5 6 1.5 7.5 1.5S11.5 2.5 13.5 4.5M3 6.5C4.5 5 6 4.5 7.5 4.5S10.5 5 12 6.5M5 8.5C6 7.5 6.75 7.25 7.5 7.25S9 7.5 10 8.5M7.5 10.5C7.5 10.5 7.5 10.5 7.5 10.5"/></svg>
                    <div className="rsp-relative rsp-flex rsp-items-center">
                      <div className="rsp-w-[18px] rsp-h-[9px] rsp-border-[1px] rsp-border-black rsp-border-opacity-60 rsp-rounded-[2px] rsp-relative">
                        <div className="rsp-absolute rsp-inset-[1px] rsp-bg-gradient-to-r rsp-from-[#34d399] rsp-to-[#10b981] rsp-rounded-[1px] rsp-w-[13px] rsp-shadow-inner"></div>
                      </div>
                      <div className="rsp-absolute rsp-right-[-2px] rsp-top-[2px] rsp-w-[1px] rsp-h-[5px] rsp-bg-black rsp-bg-opacity-60 rsp-rounded-[0.5px]"></div>
                    </div>
                  </div>
                </div>
                
                {/* WhatsApp Header */}
                <div className="rsp-absolute rsp-top-[45px] rsp-left-0 rsp-right-0 rsp-h-[60px] rsp-bg-gradient-to-r rsp-from-[#075E54] rsp-via-[#0a6b5f] rsp-to-[#128C7E] rsp-flex rsp-items-center rsp-px-4 rsp-gap-3 rsp-z-10 rsp-shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                  <svg className="rsp-w-5 rsp-h-5 rsp-text-white rsp-opacity-95 rsp-drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/></svg>
                  <div className="rsp-w-[36px] rsp-h-[36px] rsp-bg-gradient-to-br rsp-from-[#25D366] rsp-via-[#20c55e] rsp-to-[#128C7E] rsp-rounded-full rsp-flex rsp-items-center rsp-justify-center rsp-shadow-[0_2px_6px_rgba(0,0,0,0.2)] rsp-border-[2px] rsp-border-white rsp-border-opacity-30">
                    <span className="rsp-text-white rsp-text-[14px] rsp-font-bold rsp-drop-shadow-sm">B</span>
                  </div>
                  <div className="rsp-flex-1">
                    <div className="rsp-text-white rsp-text-[14px] rsp-font-semibold rsp-drop-shadow-sm rsp-tracking-tight">Business</div>
                    <div className="rsp-text-[#B8E6D1] rsp-text-[11px] rsp-opacity-85 rsp-font-medium">WhatsApp Business</div>
                  </div>
                  <div className="rsp-flex rsp-gap-4">
                    <svg className="rsp-w-4 rsp-h-4 rsp-text-white rsp-opacity-90 rsp-drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                    <svg className="rsp-w-4 rsp-h-4 rsp-text-white rsp-opacity-90 rsp-drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                  </div>
                </div>

                {/* Chat Area */}
                <div className="rsp-absolute rsp-top-[105px] rsp-left-0 rsp-right-0 rsp-bottom-[60px] rsp-bg-gradient-to-b rsp-from-[#E8E2DB] rsp-via-[#E5DDD5] rsp-to-[#DDD5CC] rsp-overflow-y-auto">
                  <div className="rsp-absolute rsp-inset-0 rsp-opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.08'%3E%3Cpath d='M40 40c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8 8-3.6 8-8zm0-32c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8 8-3.6 8-8zm32 32c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8 8-3.6 8-8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}></div>
                  
                  <div className="rsp-relative rsp-px-4 rsp-py-4">
                    {!hasContent ? (
                      <div className="rsp-flex rsp-items-center rsp-justify-center rsp-h-[300px]">
                        <div className="rsp-text-center rsp-text-gray-500 rsp-animate-fade-in">
                          <div className="rsp-w-12 rsp-h-12 rsp-bg-gradient-to-br rsp-from-gray-50 rsp-to-gray-100 rsp-rounded-full rsp-flex rsp-items-center rsp-justify-center rsp-mx-auto rsp-mb-2 rsp-shadow-md rsp-border rsp-border-gray-200">
                            <svg className="rsp-w-6 rsp-h-6 rsp-text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
                          </div>
                          <p className="rsp-text-xs rsp-font-medium rsp-text-gray-600">Start building your template</p>
                          <p className="rsp-text-xs rsp-mt-1 rsp-text-gray-500">Add content to see a live preview</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Message Bubble */}
                        <div className="rsp-flex rsp-justify-start rsp-mb-4">
                          <div className="rsp-bg-gradient-to-b rsp-from-white rsp-to-[#fafafa] rsp-rounded-[12px] rsp-max-w-[220px] rsp-shadow-[0_2px_8px_rgba(0,0,0,0.08)] rsp-relative rsp-border rsp-border-gray-100 rsp-animate-slide-up">
                            <div className="rsp-absolute rsp-left-[-6px] rsp-top-[12px] rsp-w-0 rsp-h-0 rsp-border-t-[6px] rsp-border-t-transparent rsp-border-r-[6px] rsp-border-r-white rsp-border-b-[6px] rsp-border-b-transparent rsp-drop-shadow-sm"></div>
                            
                            {/* Header Content */}
                            {template.headerType === 'TEXT' && template.headerText && (
                              <div className="rsp-px-4 rsp-pt-3 rsp-pb-2">
                                <div className="rsp-text-[14px] rsp-font-bold rsp-text-[#1f2937] rsp-leading-tight rsp-tracking-tight rsp-break-all">
                                  {renderText(template.headerText)}
                                </div>
                              </div>
                            )}
                            
                            {template.headerType === 'MEDIA' && template.mediaUrl && (
                              <div className="rsp-mb-0">
                                {template.mediaType === 'IMAGE' && (
                                  <img 
                                    src={template.mediaUrl} 
                                    alt="Header media" 
                                    className="rsp-w-full rsp-max-h-[120px] rsp-object-cover rsp-rounded-t-[12px] rsp-shadow-sm"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  />
                                )}
                                {template.mediaType === 'VIDEO' && (
                                  <div className="rsp-relative rsp-w-full rsp-h-[120px] rsp-bg-gradient-to-br rsp-from-gray-800 rsp-to-gray-900 rsp-rounded-t-[12px] rsp-flex rsp-items-center rsp-justify-center">
                                    <div className="rsp-w-12 rsp-h-12 rsp-bg-black rsp-bg-opacity-70 rsp-rounded-full rsp-flex rsp-items-center rsp-justify-center rsp-shadow-lg rsp-border rsp-border-white rsp-border-opacity-20">
                                      <div className="rsp-w-0 rsp-h-0 rsp-border-l-[8px] rsp-border-l-white rsp-border-t-[6px] rsp-border-t-transparent rsp-border-b-[6px] rsp-border-b-transparent rsp-ml-1"></div>
                                    </div>
                                    <div className="rsp-absolute rsp-bottom-2 rsp-right-2 rsp-bg-black rsp-bg-opacity-75 rsp-text-white rsp-text-[10px] rsp-px-2 rsp-py-1 rsp-rounded-full rsp-shadow-md rsp-backdrop-blur-sm">
                                      📹 Video
                                    </div>
                                  </div>
                                )}
                                {template.mediaType === 'DOCUMENT' && (
                                  <div className="rsp-p-3 rsp-bg-gradient-to-r rsp-from-gray-50 rsp-to-gray-100 rsp-rounded-t-[12px] rsp-flex rsp-items-center rsp-gap-2">
                                    <div className="rsp-w-10 rsp-h-10 rsp-bg-gradient-to-br rsp-from-red-500 rsp-to-red-600 rsp-rounded-lg rsp-flex rsp-items-center rsp-justify-center rsp-shadow-md">
                                      <span className="rsp-text-white rsp-text-[9px] rsp-font-bold">PDF</span>
                                    </div>
                                    <div>
                                      <div className="rsp-text-[12px] rsp-font-semibold rsp-text-gray-800">Document</div>
                                      <div className="rsp-text-[10px] rsp-text-gray-600">PDF • 1.2 MB</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Body Text */}
                            {template.body && (
                              <div className="rsp-px-4 rsp-py-2">
                                <div className="rsp-text-[12px] rsp-text-[#1f2937] rsp-leading-relaxed rsp-whitespace-pre-wrap rsp-tracking-tight rsp-break-all">
                                  {renderText(template.body)}
                                </div>
                              </div>
                            )}
                            
                            {/* Footer */}
                            {template.footer && (
                              <div className="rsp-px-4 rsp-pb-2">
                                <div className="rsp-text-[10px] rsp-text-[#6b7280] rsp-pt-2 rsp-border-t rsp-border-gray-100">
                                  {template.footer}
                                </div>
                              </div>
                            )}
                            
                            {/* Timestamp */}
                            <div className="rsp-px-4 rsp-pb-2 rsp-text-right">
                              <div className="rsp-text-[9px] rsp-text-[#667781] rsp-flex rsp-items-center rsp-justify-end rsp-gap-1 rsp-opacity-80">
                                9:41 AM
                                <svg className="rsp-w-2 rsp-h-2 rsp-text-blue-500" viewBox="0 0 16 15" fill="currentColor"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l3.61 3.463c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.064-.512z"/></svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Buttons */}
                        {template.buttons.length > 0 && (
                          <div className="rsp-flex rsp-justify-start">
                            <div className="rsp-bg-gradient-to-b rsp-from-white rsp-to-[#fafafa] rsp-rounded-[12px] rsp-overflow-hidden rsp-shadow-[0_2px_8px_rgba(0,0,0,0.08)] rsp-max-w-[220px] rsp-w-full rsp-border rsp-border-gray-100 rsp-animate-slide-up">
                              <ButtonList 
                                buttons={template.buttons}
                                onShowAllOptions={() => setShowButtonList(true)}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                {/* Input Area */}
                <div className="rsp-absolute rsp-bottom-0 rsp-left-0 rsp-right-0 rsp-h-[60px] rsp-bg-gradient-to-r rsp-from-[#F0F2F5] rsp-via-[#EBEDF0] rsp-to-[#E8EAED] rsp-flex rsp-items-center rsp-px-4 rsp-gap-2 rsp-border-t rsp-border-gray-200 rsp-shadow-[0_-1px_4px_rgba(0,0,0,0.05)]">
                  <svg className="rsp-w-6 rsp-h-6 rsp-text-[#54656F] rsp-opacity-60" viewBox="0 0 24 24" fill="currentColor"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
                  <div className="rsp-flex-1 rsp-bg-gradient-to-r rsp-from-white rsp-to-[#fafafa] rsp-rounded-[24px] rsp-px-4 rsp-py-2 rsp-flex rsp-items-center rsp-min-h-[36px] rsp-shadow-[0_1px_2px_rgba(0,0,0,0.1)] rsp-border rsp-border-gray-200">
                    <span className="rsp-text-[13px] rsp-text-[#667781] rsp-opacity-70 rsp-font-normal">Type a message</span>
                  </div>
                  <div className="rsp-w-9 rsp-h-9 rsp-bg-gradient-to-br rsp-from-[#25D366] rsp-via-[#20c55e] rsp-to-[#00A884] rsp-rounded-full rsp-flex rsp-items-center rsp-justify-center rsp-shadow-[0_2px_6px_rgba(37,211,102,0.3)] rsp-border rsp-border-[#20c55e] rsp-border-opacity-30">
                    <svg className="rsp-w-4 rsp-h-4 rsp-text-white rsp-drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                  </div>
                </div>

                {/* --- In-Preview Button List --- */}
                {showButtonList && (
                  <div className="rsp-absolute rsp-inset-0 rsp-bg-black rsp-bg-opacity-40 rsp-z-30 rsp-flex rsp-items-end rsp-animate-fade-in">
                    <div 
                      className="rsp-w-full rsp-bg-[#F0F2F5] rsp-rounded-t-2xl rsp-shadow-lg rsp-animate-slide-up"
                    >
                      {/* List Header */}
                      <div className="rsp-p-4 rsp-border-b rsp-border-gray-300">
                        <h4 className="rsp-font-bold rsp-text-center rsp-text-gray-800 rsp-text-md">
                          {template.body || 'Options'}
                        </h4>
                      </div>

                      {/* Button Items */}
                      <div className="rsp-max-h-[250px] rsp-overflow-y-auto">
                        {template.buttons.map((button, index) => (
                          <div 
                            key={button.id}
                            className={`rsp-p-4 rsp-text-center rsp-text-md rsp-text-blue-600 ${index < template.buttons.length - 1 ? 'rsp-border-b rsp-border-gray-300' : ''}`}
                          >
                            {button.text}
                          </div>
                        ))}
                      </div>

                      {/* Close Button */}
                      <div
                        onClick={() => setShowButtonList(false)}
                        className="rsp-mt-2 rsp-p-4 rsp-text-center rsp-font-bold rsp-text-blue-600 rsp-bg-white rsp-cursor-pointer rsp-shadow-inner"
                      >
                        Close
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}