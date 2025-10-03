import React, { useState } from 'react';
import { Template } from '../types';
import EmojiModal from './emoji/EmojiModal';
import { Smile, Type, Image, Video, FileText, Paperclip, Eye } from 'lucide-react';

type Props = {
  template: Template;
  setTemplate: React.Dispatch<React.SetStateAction<Template>>;
};

export default function MessageStructure({ template, setTemplate }: Props) {
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const [currentInputRef, setCurrentInputRef] = useState<'body' | 'footer' | null>(null);
  const [bodyTextareaRef, setBodyTextareaRef] = useState<HTMLTextAreaElement | null>(null);
  const [footerInputRef, setFooterInputRef] = useState<HTMLInputElement | null>(null);

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

  const addVariable = () => {
    const lastNumber = getLastVariableNumberInTemplate();
    const nextNumber = lastNumber + 1;
    const variable = `{{${nextNumber}}}`;
    
    if (bodyTextareaRef && template.body.length + variable.length <= 1024) {
      const cursorPosition = bodyTextareaRef.selectionStart || template.body.length;
      const beforeCursor = template.body.substring(0, cursorPosition);
      const afterCursor = template.body.substring(cursorPosition);
      const newBody = beforeCursor + variable + afterCursor;
      
      setTemplate({ 
        ...template, 
        body: newBody
      });
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        if (bodyTextareaRef) {
          const newPosition = cursorPosition + variable.length;
          bodyTextareaRef.setSelectionRange(newPosition, newPosition);
          bodyTextareaRef.focus();
        }
      }, 0);
    }
  };

  const openEmojiModalForBody = () => {
    setCurrentInputRef('body');
    setShowEmojiModal(true);
    // Focus body textarea if not already focused
    setTimeout(() => {
      if (bodyTextareaRef) {
        bodyTextareaRef.focus();
      }
    }, 0);
  };
  const handleEmojiSelect = (emoji: string) => {
    if (currentInputRef === 'body') {
      if (!bodyTextareaRef) return;
      
      const cursorPosition = bodyTextareaRef.selectionStart || template.body.length;
      const maxLength = 1024;
      const currentText = template.body;

      if (currentText.length + emoji.length <= maxLength) {
        const beforeCursor = currentText.substring(0, cursorPosition);
        const afterCursor = currentText.substring(cursorPosition);
        const newBody = beforeCursor + emoji + afterCursor;
        
        setTemplate({
          ...template,
          body: newBody
        });
        
        // Set cursor position after the inserted emoji
        setTimeout(() => {
          if (bodyTextareaRef) {
            const newPosition = cursorPosition + emoji.length;
            bodyTextareaRef.setSelectionRange(newPosition, newPosition);
            bodyTextareaRef.focus();
          }
        }, 0);
      }
    } else if (currentInputRef === 'footer') {
      if (!footerInputRef) return;
      
      const cursorPosition = footerInputRef.selectionStart || template.footer.length;
      const maxLength = 60;
      const currentText = template.footer;

      if (currentText.length + emoji.length <= maxLength) {
        const beforeCursor = currentText.substring(0, cursorPosition);
        const afterCursor = currentText.substring(cursorPosition);
        const newFooter = beforeCursor + emoji + afterCursor;
        
        setTemplate({
          ...template,
          footer: newFooter
        });
        
        // Set cursor position after the inserted emoji
        setTimeout(() => {
          if (footerInputRef) {
            const newPosition = cursorPosition + emoji.length;
            footerInputRef.setSelectionRange(newPosition, newPosition);
            footerInputRef.focus();
          }
        }, 0);
      }
    }
  };

  return (
    <div className="rsp-space-y-6">
      {/* Message Body */}
      <div>
        <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-2">
          Body
        </label>
        <div className="rsp-relative">
          <textarea
            ref={setBodyTextareaRef}
            value={template.body}
            onChange={(e) => setTemplate({ ...template, body: e.target.value })}
            maxLength={1024}
            rows={6}
            className="rsp-w-full rsp-px-3 rsp-py-2 rsp-border rsp-border-gray-300 rsp-rounded-md rsp-text-sm focus:rsp-outline-none focus:rsp-border-blue-500 rsp-bg-white rsp-resize-none rsp-shadow-sm"
            placeholder="Enter the text for your message"
            onFocus={() => setCurrentInputRef('body')}
          />
        </div>
        
        {/* Toolbar */}
        <div className="rsp-flex rsp-items-center rsp-justify-between rsp-mt-2">
          <div className="rsp-flex rsp-items-center rsp-gap-2">
            <button
              onClick={openEmojiModalForBody}
              className="rsp-p-1 rsp-text-gray-500 hover:rsp-text-gray-700 hover:rsp-bg-gray-100 rsp-rounded"
              title="Add emoji"
            >
              <Smile className="rsp-w-4 rsp-h-4" />
            </button>
            <button
              onClick={addVariable}
              className="rsp-px-2 rsp-py-1 rsp-text-xs rsp-bg-gray-100 hover:rsp-bg-gray-200 rsp-rounded rsp-text-gray-700"
            >
              Add Variable
            </button>
          </div>
          <div className="rsp-flex rsp-items-center rsp-gap-2">
            <span className="rsp-text-xs rsp-text-gray-500">
              {template.body.length}/1024 (1 WhatsAppAudience)
            </span>
          </div>
        </div>
        
        {/* Sample Values for Body Variables */}
        {(() => {
          const bodyVariables = template.body.match(/\{\{(\d+)\}\}/g) || [];
          const uniqueVariables = [...new Set(bodyVariables.map(match => match.replace(/[{}]/g, '')))];
          
          if (uniqueVariables.length === 0) return null;
          
          return (
            <div className="rsp-mt-3">
              <p className="rsp-text-xs rsp-font-medium rsp-text-gray-600 rsp-mb-2">Sample Values</p>
              <div className="rsp-grid rsp-grid-cols-3 rsp-gap-2">
                {uniqueVariables.map((variable) => (
                  <div key={`body-sample-${variable}`} className="rsp-flex rsp-items-center rsp-gap-2">
                    <label className="rsp-text-xs rsp-text-gray-500 rsp-whitespace-nowrap">
                      {'{{'}{variable}{'}}'}: 
                    </label>
                    <input
                      type="text"
                      value={template.sampleContent?.bodyVariables?.[variable] || ''}
                      onChange={(e) => {
                        const newSampleContent = {
                          ...template.sampleContent,
                          bodyVariables: {
                            ...template.sampleContent?.bodyVariables,
                            [variable]: e.target.value
                          },
                          headerVariables: template.sampleContent?.headerVariables || {}
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

      {/* Footer */}
      <div>
        <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-2">
          Footer (optional)
        </label>
        <div className="rsp-relative">
          <input
            ref={setFooterInputRef}
            type="text"
            value={template.footer}
            onChange={(e) => setTemplate({ ...template, footer: e.target.value })}
            maxLength={60}
            className="rsp-w-full rsp-px-0 rsp-py-2 rsp-border-0 rsp-border-b rsp-border-gray-300 rsp-text-sm focus:rsp-outline-none focus:rsp-border-blue-500 rsp-bg-transparent"
            placeholder="Footer Text"
            onFocus={() => setCurrentInputRef('footer')}
          />
        </div>
        <p className="rsp-text-xs rsp-text-gray-500 rsp-mt-1">
          {template.footer.length}/60 characters
        </p>
      </div>

      <EmojiModal
        isOpen={showEmojiModal}
        onClose={() => setShowEmojiModal(false)}
        onSelect={handleEmojiSelect}
      />
    </div>
  );
}