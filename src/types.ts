import React from 'react';

export type MessageCategory = 'MARKETING' | 'UTILITY';

export type MessageType = 'BASIC' | 'CAROUSEL';

export type HeaderType = 'NONE' | 'TEXT' | 'MEDIA';

export type MediaType = 'IMAGE' | 'DOCUMENT' | 'VIDEO';

export type Language = {
  value: string;
  label: string;
};

export type Button = {
  id: string;
  type: 'QUICK_REPLY' | 'URL' | 'CALL' | 'PHONE_NUMBER' | 'FLOW';
  text: string;
  value?: string;
  urlType?: 'static' | 'dynamic';
  dynamicUrl?: string;
};

export type SampleContent = {
  headerVariables: Record<string, string>;
  bodyVariables: Record<string, string>;
  buttonVariables : Record<string, string>;
  sampleUrl?: string;
};

export type Template = {
  name: string;
  category: MessageCategory;
  type: MessageType;
  language: string;
  enableClickTracking: boolean;
  headerType: HeaderType;
  headerText: string;
  mediaType?: MediaType;
  mediaUrl?: string;
  body: string;
  footer: string;
  buttons: Button[];
  sampleContent?: SampleContent;
};