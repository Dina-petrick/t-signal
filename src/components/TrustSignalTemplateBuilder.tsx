import React from 'react';
import { Template } from '../types';
import Section from './sections/Section';
import TemplateCategorySection from './sections/TemplateCategorySection';
import TemplateTypeSection from './sections/TemplateTypeSection';
import ClickTrackingSection from './sections/ClickTrackingSection';
import HeaderSection from './sections/HeaderSection';
import MessageStructure from './MessageStructure';
import ButtonsSection from './buttons/ButtonsSection';
import TemplateNameSection from './sections/TemplateNameSection';
import TemplateLanguageSection from './sections/TemplateLanguageSection';

type Props = {
  template: Template;
  setTemplate: React.Dispatch<React.SetStateAction<Template>>;
};

export function TrustSignalTemplateBuilder({ template, setTemplate }: Props) {
  return (
    <div className="rsp-space-y-6">
      {/* Header and Content */}
      <div className="rsp-space-y-6">
        <h2 className="rsp-text-lg rsp-font-semibold rsp-text-gray-900">Message Content</h2>
        <div className="rsp-space-y-6">
          <HeaderSection template={template} setTemplate={setTemplate} />
          <MessageStructure template={template} setTemplate={setTemplate} />
        </div>
      </div>

      {/* Buttons */}
      <div className="rsp-space-y-6">
        <ButtonsSection 
          template={template} 
          setTemplate={setTemplate}
        />
      </div>
    </div>
  );
}