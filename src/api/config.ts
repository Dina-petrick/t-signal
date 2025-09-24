export const API_CONFIG = {
  BASE_URL: 'https://wpapi.trustsignal.io/api/v1',
  ENDPOINTS: {
    TEMPLATES: '/template',
    TEMPLATE_LIST: '/template?page=1&limit=100'
  }
} as const;