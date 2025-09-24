import React from 'react';
import { Template, MessageType } from '../../types';

type Props = {
  template: Template;
  setTemplate: React.Dispatch<React.SetStateAction<Template>>;
};

const templateTypes: { value: MessageType; label: string; description: string }[] = [
  {
    value: 'BASIC',
    label: 'Basic',
    description: 'Standard text message with optional header, footer, and buttons'
  },
  // {
  //   value: 'CAROUSEL',
  //   label: 'Carousel',
  //   description: 'Multiple cards with images, text, and buttons'
  // }
];

export default function TemplateTypeSection({ template, setTemplate }: Props) {
  return (
    <div>
      <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-1">
        Template Type
      </label>
      <select
        value={template.type}
        onChange={(e) => setTemplate({ ...template, type: e.target.value as MessageType })}
        className="rsp-w-full rsp-px-3 rsp-py-2 rsp-border rsp-border-gray-300 rsp-rounded-md rsp-shadow-sm focus:rsp-ring-blue-500 focus:rsp-border-blue-500"
      >
        {templateTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label} - {type.description}
          </option>
        ))}
      </select>
    </div>
  );
}