import React from 'react';
import { Template } from '../../types';

type Props = {
  template: Template;
  setTemplate: React.Dispatch<React.SetStateAction<Template>>;
};

const trackingOptions = [
  { value: true, label: 'Enable - Track button clicks and interactions' },
  { value: false, label: 'Disable - No click tracking' }
];

export default function ClickTrackingSection({ template, setTemplate }: Props) {
  return (
    <div>
      <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-1">
        Click Tracking
      </label>
      <select
        value={template.enableClickTracking.toString()}
        onChange={(e) => setTemplate({ ...template, enableClickTracking: e.target.value === 'true' })}
        className="rsp-w-full rsp-px-3 rsp-py-2 rsp-border rsp-border-gray-300 rsp-rounded-md rsp-shadow-sm focus:rsp-ring-blue-500 focus:rsp-border-blue-500"
      >
        {trackingOptions.map((option) => (
          <option key={option.value.toString()} value={option.value.toString()}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}