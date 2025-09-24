export type ApiCredentials = {
  apiKey: string;
};

export type ApiResponse = {
  status: 'success' | 'error';
  message: string;
  data?: any;
};

export type ButtonType = 'QUICK_REPLY' | 'URL' | 'CALL';

export type ButtonData = {
  type: ButtonType;
  text: string;
  value?: string;
  urlType?: 'static' | 'dynamic';
  url?: string;
  example?: string | string[];
};

export type TrustSignalTemplate = {
  id: string;
  account_id: string;
  name: string;
  lang: string;
  status: string;
  category: string;
  temp_route: string;
  temptype: string;
  temp_var_data: string;
  jsonstruct: string;
  placeholder: null | string;
  temp_error: string;
  medialist: {
    header?: string;
  };
  updated_by: string;
  shortlink: number;
  Buttonurls: null | string[];
  created_at: string;
  modified_at: string;
};

export type TemplateListResponse = {
  id: string | number;
  name: string;
  category: string;
  language: string;
  type: string;
  body: string;
  status: string;
  creation_time: number;
  updation_time: number;
  medialist?: {
    header?: string;
  };
  shortlink?: number;
};