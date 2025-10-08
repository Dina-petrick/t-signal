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
  // onFileUpload: (file: File) => Promise<string>;
  setTemplate: React.Dispatch<React.SetStateAction<Template>>;
};

  const mockFileUpload = (file: File): Promise<string> => {
    console.log(`Uploading file: ${file.name}`);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type === 'application/pdf') {
          const fileUrl = URL.createObjectURL(file);
          console.log(`File uploaded successfully: ${fileUrl}`);
          resolve(fileUrl);
        } else {
          console.error('Upload failed: Unsupported file type.');
          reject(new Error('Mock upload failed. Unsupported file type.'));
        }
      }, 1500);
    });
  };

  const onFileUpload = async (file: File): Promise<string> => {
    try {
      const filePath = await mockFileUpload(file);
      return filePath;
    } catch (error) {
      console.error('Upload failed in parent:', error);
      throw error;
    }
  };

export function TrustSignalTemplateBuilder({ template, setTemplate }: Props) {
  return (
    <div className="rsp-space-y-6">
      {/* Header and Content */}
      <div className="rsp-space-y-6">
        <h2 className="rsp-text-lg rsp-font-semibold rsp-text-gray-900">Message Content</h2>
        <div className="rsp-space-y-6">
          <HeaderSection template={template} setTemplate={setTemplate} onFileUpload={onFileUpload} />
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