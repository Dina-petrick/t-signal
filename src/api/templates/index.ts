import { ApiCredentials, ApiResponse } from '../types';
import { Template } from '../../types';
import { createTrustSignalTemplate } from './trustsignal';

export const createTemplate = async (
  credentials: ApiCredentials,
  template: Template
): Promise<ApiResponse> => {
  try {
    // Validate required fields
    if (!template.name || !template.body) {
      throw new Error('Missing required template fields: name and body are required');
    }

    if (!credentials.apiKey) {
      throw new Error('Missing TrustSignal API key');
    }

    return await createTrustSignalTemplate(credentials.apiKey, template);

  } catch (error) {
    console.error('API Error:', error);
    return {
      status: 'error',
      message: error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred while creating the template'
    };
  }
};