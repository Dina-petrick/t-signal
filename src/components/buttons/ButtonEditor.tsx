import React from 'react';
import { Button } from '../../types';
import ButtonIcon from './ButtonIcon';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

type Props = {
  button: Button;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onTextChange: (text: string) => void;
  onValueChange: (value: string) => void;
};

export default function ButtonEditor({
  button,
  isExpanded,
  onToggle,
  onRemove,
  onTextChange,
  onValueChange
}: Props) {
  return (
    <div className="rsp-border rsp-border-gray-200 rsp-rounded-lg rsp-overflow-hidden">
      <div 
        className="rsp-flex rsp-items-center rsp-justify-between rsp-p-4 rsp-bg-gray-50 rsp-cursor-pointer"
        onClick={onToggle}
      >
        <div className="rsp-flex rsp-items-center rsp-space-x-2">
          {isExpanded ? <ChevronUp className="rsp-w-4 rsp-h-4" /> : <ChevronDown className="rsp-w-4 rsp-h-4" />}
          <span className="rsp-font-medium">{button.text || `${button.type.replace(/_/g, ' ')} Button`}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="rsp-p-1 hover:rsp-bg-gray-200 rsp-rounded-full"
        >
          <X className="rsp-w-4 rsp-h-4" />
        </button>
      </div>

      {isExpanded && (
        <div className="rsp-p-4 rsp-space-y-4">
          <div>
            <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-1">
              Button Text
            </label>
            <div className="rsp-relative">
              <div className="rsp-flex">
                <div className="rsp-flex rsp-items-center rsp-px-3 rsp-py-2 rsp-bg-gray-100 rsp-border rsp-border-r-0 rsp-border-gray-300 rsp-rounded-l-md">
                  <ButtonIcon type={button.type} />
                </div>
                <input
                  type="text"
                  value={button.text}
                  onChange={(e) => onTextChange(e.target.value)}
                  maxLength={25}
                  className="rsp-flex-1 rsp-px-3 rsp-py-2 rsp-border rsp-border-l-0 rsp-border-gray-300 rsp-rounded-r-md focus:rsp-ring-blue-500 focus:rsp-border-blue-500"
                  placeholder="Enter button text"
                />
              </div>
              <span className="rsp-absolute rsp-right-2 rsp-top-1/2 rsp-transform -rsp-translate-y-1/2 rsp-text-xs rsp-text-gray-400">
                {button.text.length}/25
              </span>
            </div>
          </div>

          {(button.type === 'URL' || button.type === 'CALL' || button.type === 'OFFER') && (
            <div>
              <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-1">
                {button.type === 'URL' ? 'Website URL' : 
                 button.type === 'CALL' ? 'Phone Number' : 
                 'Offer Code'}
              </label>
              <div className="rsp-relative">
                <input
                  type={button.type === 'CALL' ? 'tel' : 'text'}
                  value={button.value || ''}
                  onChange={(e) => onValueChange(e.target.value)}
                  maxLength={button.type === 'URL' ? 2000 : 20}
                  className="rsp-w-full rsp-px-3 rsp-py-2 rsp-border rsp-border-gray-300 rsp-rounded-md"
                  placeholder={
                    button.type === 'URL' ? 'https://example.com' :
                    button.type === 'CALL' ? '+1234567890' :
                    'OFFER123'
                  }
                />
                <span className="rsp-absolute rsp-right-2 rsp-top-1/2 rsp-transform -rsp-translate-y-1/2 rsp-text-xs rsp-text-gray-400">
                  {(button.value || '').length}/{button.type === 'URL' ? 2000 : 20}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}