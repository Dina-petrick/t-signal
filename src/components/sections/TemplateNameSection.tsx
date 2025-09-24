import React from 'react';
import { Template } from '../../types';

type TemplateNameProps = {
  template: Template;
  setTemplate: (template: Template) => void;
};

export default function TemplateNameSection({ template, setTemplate }: TemplateNameProps) {
  const handleNameChange = (value: string) => {
    // Only allow letters, numbers and underscores
    const sanitizedValue = value.replace(/[^a-zA-Z0-9_]/g, '');
    setTemplate({ ...template, name: sanitizedValue });
  };

  return (
    <div>
      <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-1">
        Template Name
      </label>
      <p className="rsp-text-sm rsp-text-gray-500 rsp-mb-2">
        Template names can only contain letters, numbers and underscores.
      </p>
      <input
        type="text"
        value={template.name}
        onChange={(e) => handleNameChange(e.target.value)}
        className="rsp-w-full rsp-px-3 rsp-py-2 rsp-border rsp-border-gray-300 rsp-rounded-md rsp-shadow-sm focus:rsp-ring-blue-500 focus:rsp-border-blue-500"
        placeholder="Enter message template name..."
      />
    </div>
  );
}