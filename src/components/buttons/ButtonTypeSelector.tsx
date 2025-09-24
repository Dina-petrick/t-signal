import React from 'react';
import { Button } from '../../types';
import ButtonIcon from './ButtonIcon';

type Props = {
  type: Button['type'];
  isDisabled: boolean;
  buttonCount: number;
  maxCount: number;
  onClick: () => void;
};

export default function ButtonTypeSelector({ type, isDisabled, buttonCount, maxCount, onClick }: Props) {
  return (
    <div className="rsp-flex-1 rsp-min-w-[200px]">
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`rsp-w-full rsp-px-4 rsp-py-2 rsp-rounded-md rsp-border rsp-text-sm rsp-font-medium rsp-transition-colors
          ${isDisabled
            ? 'rsp-bg-gray-50 rsp-text-gray-400 rsp-border-gray-200 rsp-cursor-not-allowed'
            : 'rsp-bg-white rsp-text-gray-700 rsp-border-gray-300 hover:rsp-bg-gray-50 hover:rsp-border-gray-400'
          }`}
      >
        <div className="rsp-flex rsp-items-center rsp-justify-center rsp-gap-2">
          <ButtonIcon type={type} />
          <span>{type}</span>
        </div>
      </button>
      <p className="rsp-text-xs rsp-text-gray-500 rsp-mt-1 rsp-text-center">
        {buttonCount}/{maxCount} {type.replace(/_/g, ' ')}s
      </p>
    </div>
  );
}