import React from 'react';
import { Template, MessageCategory } from '../../types';

type Props = {
  template: Template;
  setTemplate: React.Dispatch<React.SetStateAction<Template>>;
};

const categories: { value: MessageCategory; label: string; description: string }[] = [
  {
    value: 'MARKETING',
    label: 'Marketing',
    description: 'Promotional messages, offers, and announcements'
  },
  {
    value: 'UTILITY',
    label: 'Utility',
    description: 'Transactional messages, confirmations, and updates'
  }
];

export default function TemplateCategorySection({ template, setTemplate }: Props) {
  return (
    <div>
      <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-1">
        Category
      </label>
      <select
        value={template.category}
        onChange={(e) => setTemplate({ ...template, category: e.target.value as MessageCategory })}
        className="rsp-w-full rsp-px-3 rsp-py-2 rsp-border rsp-border-gray-300 rsp-rounded-md rsp-shadow-sm focus:rsp-ring-blue-500 focus:rsp-border-blue-500"
      >
        {categories.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label} - {category.description}
          </option>
        ))}
      </select>
    </div>
  );
}