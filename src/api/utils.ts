/**
 * Utility functions for API operations
 */

/**
 * Extract variables from template text
 */
export const extractVariables = (text: string): string[] => {
  const matches = text.match(/{{(\d+)}}/g) || [];
  return matches.map(match => match.replace(/[{}]/g, ''));
};

/**
 * Format form data for API request
 */
export const formatFormData = (formData: FormData): void => {
  // Log FormData for debugging
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
};

/**
 * Validate template name
 */
export const validateTemplateName = (name: string): boolean => {
  return /^[a-zA-Z0-9_]+$/.test(name);
};

/**
 * Format button data for API request
 */
export const formatButtonData = (buttons: any[]): string => {
  return JSON.stringify(buttons.map(button => {
    if (button.type === 'QUICK_REPLY') {
      return button.text;
    }
    return button;
  }));
};