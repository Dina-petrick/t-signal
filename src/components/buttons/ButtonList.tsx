import React from 'react';
import { Button } from '../../types';
import ButtonIcon from './ButtonIcon';
import { ArrowRight } from 'lucide-react';

type ButtonListProps = {
  buttons: Button[];
  flowButtonText?: string;
  onShowAllOptions: () => void;
};

export default function ButtonList({ buttons, flowButtonText, onShowAllOptions }: ButtonListProps) {
  const allButtons = [...buttons];
  if (flowButtonText) {
    allButtons.push({
      id: 'flow-button',
      type: 'QUICK_REPLY',
      text: flowButtonText,
    });
  }

  const visibleButtons = allButtons.slice(0, 2);

  return (
    <div className="rsp-divide-y rsp-divide-gray-200">
      {visibleButtons.map((button) => (
        <button
          key={button.id}
          className="rsp-w-full rsp-py-4 rsp-text-[#128C7E] rsp-text-[15px] rsp-font-medium rsp-bg-white hover:rsp-bg-gray-50 rsp-flex rsp-items-center rsp-gap-3 rsp-px-4 rsp-transition-colors"
        >
          <div className="rsp-text-[#128C7E]">
            <ButtonIcon type={button.type} />
          </div>
          <span>{button.text}</span>
          {button.id === 'flow-button' && (
            <ArrowRight className="rsp-w-5 rsp-h-5 rsp-text-[#128C7E] rsp-ml-auto" />
          )}
        </button>
      ))}
      {allButtons.length > 2 && (
        <button
          onClick={onShowAllOptions}
          className="rsp-w-full rsp-py-4 rsp-text-[#128C7E] rsp-text-[15px] rsp-font-medium rsp-bg-white hover:rsp-bg-gray-50 rsp-flex rsp-items-center rsp-justify-center rsp-transition-colors"
        >
          <span className="rsp-text-lg rsp-mr-2">⋯</span>
          See all options
        </button>
      )}
    </div>
  );
}