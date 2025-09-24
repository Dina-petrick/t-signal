import React from 'react';
import { Button } from '../../types';
import { Link, Phone, Workflow, Plus } from 'lucide-react';

type Props = {
  onSelect: (type: Button['type'], text: string, value: string, urlType?: 'static' | 'dynamic', dynamicUrl?: string) => void;
  existingButtons: Button[];
};

export default function CallToActionSelector({ onSelect, existingButtons }: Props) {
  const [selectedAction, setSelectedAction] = React.useState<Button['type']>();
  const [buttonText, setButtonText] = React.useState('');
  const [buttonValue, setButtonValue] = React.useState('');
  const [urlType, setUrlType] = React.useState<'static' | 'dynamic'>('static');
  const [dynamicUrl, setDynamicUrl] = React.useState('');

  const getButtonCounts = () => ({
    url: existingButtons.filter(b => b.type === 'URL').length,
    call: existingButtons.filter(b => b.type === 'CALL').length,
    flow: existingButtons.filter(b => b.type === 'FLOW').length
  });

  const isButtonTypeDisabled = (type: Button['type']) => {
    const counts = getButtonCounts();
    switch (type) {
      case 'URL':
        return counts.url >= 2;
      case 'CALL':
        return counts.call >= 1;
      case 'FLOW':
        return counts.flow >= 1;
      default:
        return false;
    }
  };

  const getButtonLimitText = (type: Button['type']) => {
    const counts = getButtonCounts();
    switch (type) {
      case 'URL':
        return `${counts.url}/2 URLs`;
      case 'CALL':
        return `${counts.call}/1 Call`;
      case 'FLOW':
        return `${counts.flow}/1 Flow`;
      default:
        return '';
    }
  };

  const handleSubmit = () => {
    if (selectedAction && buttonText) {
      if (selectedAction === 'URL') {
        onSelect(
          selectedAction,
          buttonText,
          urlType === 'static' ? buttonValue : '',
          urlType,
          urlType === 'dynamic' ? dynamicUrl : undefined
        );
      } else {
        onSelect(selectedAction, buttonText, buttonValue);
      }
      
      // Reset form
      setSelectedAction(undefined);
      setButtonText('');
      setButtonValue('');
      setUrlType('static');
      setDynamicUrl('');
    }
  };

  const isSubmitDisabled = () => {
    if (!buttonText || !selectedAction) return true;
    
    if (selectedAction === 'URL') {
      if (urlType === 'static' && !buttonValue) return true;
      if (urlType === 'dynamic' && !dynamicUrl) return true;
    }
    
    if (selectedAction === 'CALL' && !buttonValue) return true;
    
    return false;
  };

  const actionTypes = [
    { type: 'URL' as const, label: 'Visit Website', icon: Link },
    { type: 'CALL' as const, label: 'Call Phone Number', icon: Phone },
    { type: 'FLOW' as const, label: 'Flow', icon: Workflow },
  ];

  return (
    <div className="rsp-space-y-6">
      <div>
        <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-2">
          Action button
        </label>
        <div className="rsp-relative">
          <select
            value={selectedAction || ''}
            onChange={(e) => setSelectedAction(e.target.value as Button['type'] || undefined)}
            className="rsp-w-full rsp-px-0 rsp-py-2 rsp-border-0 rsp-border-b rsp-border-gray-300 rsp-text-sm focus:rsp-outline-none focus:rsp-border-blue-500 rsp-bg-transparent rsp-appearance-none"
          >
            <option value="">Select action type</option>
            {actionTypes.map(({ type, label }) => (
              <option key={type} value={type} disabled={isButtonTypeDisabled(type)}>
                {label} {isButtonTypeDisabled(type) ? '(Limit reached)' : ''}
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

      {selectedAction && (
        <div className="rsp-space-y-6 rsp-animate-fade-in">
          {/* Button Text and Value in Grid */}
          <div className="rsp-grid rsp-grid-cols-2 rsp-gap-6">
            <div>
              <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-2">
                Button Text
              </label>
              <div className="rsp-relative">
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value.slice(0, 25))}
                  className="rsp-w-full rsp-px-0 rsp-py-2 rsp-border-0 rsp-border-b rsp-border-gray-300 rsp-text-sm focus:rsp-outline-none focus:rsp-border-blue-500 rsp-bg-transparent"
                  placeholder="Enter Button Text (Max 25 Characters)"
                  maxLength={25}
                />
                <div className="rsp-absolute rsp-bottom-0 rsp-left-0 rsp-w-4 rsp-h-0.5 rsp-bg-red-500"></div>
              </div>
              <span className="rsp-text-xs rsp-text-gray-500 rsp-mt-1">
                {buttonText.length}/25
              </span>
            </div>

            <div>
              <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-2">
                {selectedAction === 'URL' ? 'Website URL' : 
                 selectedAction === 'CALL' ? 'Phone Number' : 
                 'Flow ID'}
              </label>
              <div className="rsp-relative">
                <input
                  type={selectedAction === 'CALL' ? 'tel' : selectedAction === 'URL' ? 'url' : 'text'}
                  value={selectedAction === 'URL' && urlType === 'dynamic' ? dynamicUrl : buttonValue}
                  onChange={(e) => {
                    if (selectedAction === 'URL' && urlType === 'dynamic') {
                      setDynamicUrl(e.target.value.slice(0, 2000));
                    } else {
                      const maxLength = selectedAction === 'URL' ? 2000 : selectedAction === 'CALL' ? 20 : 50;
                      setButtonValue(e.target.value.slice(0, maxLength));
                    }
                  }}
                  className="rsp-w-full rsp-px-0 rsp-py-2 rsp-border-0 rsp-border-b rsp-border-gray-300 rsp-text-sm focus:rsp-outline-none focus:rsp-border-blue-500 rsp-bg-transparent"
                  placeholder={
                    selectedAction === 'URL' ? 'https://www.example' :
                    selectedAction === 'CALL' ? '+1xxxxxxxxxx (Max 20 Characters)' :
                    'Flow ID'
                  }
                  maxLength={selectedAction === 'URL' ? 2000 : selectedAction === 'CALL' ? 20 : 50}
                />
                <div className="rsp-absolute rsp-bottom-0 rsp-left-0 rsp-w-4 rsp-h-0.5 rsp-bg-red-500"></div>
              </div>
              <div className="rsp-flex rsp-items-center rsp-justify-between rsp-mt-1">
                <span className="rsp-text-xs rsp-text-gray-500">
                  {(selectedAction === 'URL' && urlType === 'dynamic' ? dynamicUrl : buttonValue).length}/
                  {selectedAction === 'URL' ? 2000 : selectedAction === 'CALL' ? 20 : 50}
                </span>
                {selectedAction === 'URL' && (
                  <button
                    className="rsp-flex rsp-items-center rsp-gap-1 rsp-text-xs rsp-text-blue-600 hover:rsp-text-blue-700"
                    title="Add to URL"
                  >
                    <Plus className="rsp-w-3 rsp-h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {selectedAction === 'URL' && (
            <div>
              <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-2">
                URL Type
              </label>
              <div className="rsp-flex rsp-gap-4">
                <label className="rsp-flex rsp-items-center">
                  <input
                    type="radio"
                    checked={urlType === 'static'}
                    onChange={() => {
                      setUrlType('static');
                      setDynamicUrl('');
                    }}
                    className="rsp-mr-2"
                  />
                  Static
                </label>
                <label className="rsp-flex rsp-items-center">
                  <input
                    type="radio"
                    checked={urlType === 'dynamic'}
                    onChange={() => {
                      setUrlType('dynamic');
                      setButtonValue('');
                    }}
                    className="rsp-mr-2"
                  />
                  Dynamic
                </label>
              </div>
              {urlType === 'dynamic' && (
                <p className="rsp-mt-2 rsp-text-sm rsp-text-gray-500">
                  You can add a sample URL value in the "Add Sample" section
                </p>
              )}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled()}
            className={`rsp-w-full rsp-py-2 rsp-px-4 rsp-rounded-md rsp-text-sm rsp-font-medium rsp-transition-colors
              ${isSubmitDisabled()
                ? 'rsp-bg-gray-100 rsp-text-gray-400 rsp-cursor-not-allowed'
                : 'rsp-bg-blue-600 rsp-text-white hover:rsp-bg-blue-700'
              }`}
          >
            Add Button
          </button>
        </div>
      )}
    </div>
  );
}