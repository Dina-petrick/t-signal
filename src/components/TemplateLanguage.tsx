import React from 'react';
import { Template, Language } from '../types';
import LANGUAGES from '../utils/language';

type Props = {
  template: Template;
  setTemplate: React.Dispatch<React.SetStateAction<Template>>;
};

export default function TemplateLanguage({ template, setTemplate }: Props) {
  const handleLanguageChange = (languageCode: string) => {
    setTemplate({ ...template, language: languageCode });
  };

  return (
    <div>
      <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-2">
        Select Language
      </label>
      <select
        value={template.language}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="rsp-w-full rsp-px-3 rsp-py-2 rsp-border rsp-border-gray-300 rsp-rounded-md rsp-shadow-sm focus:rsp-ring-blue-500 focus:rsp-border-blue-500"
      >
        {LANGUAGES.map((language) => (
          <option key={language.value} value={language.value}>
            {language.label}
          </option>
        ))}
      </select>
    </div>
  );
}