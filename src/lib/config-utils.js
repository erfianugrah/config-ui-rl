import { API_ENDPOINTS } from './config-variables.js';

export async function loadConfiguration() {
  const response = await fetch(API_ENDPOINTS.CONFIG);
  if (!response.ok) {
    throw new Error(`Failed to load configuration: ${response.status}`);
  }
  return response.json();
}

export async function saveConfiguration(config) {
  try {
    const response = await fetch(API_ENDPOINTS.CONFIG, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`Failed to save configuration: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error saving configuration:', error);
    throw error;
  }
}
