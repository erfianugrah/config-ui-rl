import { API_ENDPOINTS } from './config-variables.js';

function getFullUrl(path) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  return new URL(path, origin).toString();
}

export async function loadConfiguration() {
  const fullUrl = getFullUrl(API_ENDPOINTS.CONFIG);
  console.log('Loading configuration from:', fullUrl);
  try {
    const response = await fetch(fullUrl);
    console.log('Response status:', response.status);
    if (!response.ok) {
      console.error('Failed to load configuration:', response.statusText);
      throw new Error(`Failed to load configuration: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Configuration loaded:', data);
    return data;
  } catch (error) {
    console.error('Error loading configuration:', error);
    throw error;
  }
}

export async function saveConfiguration(config) {
  const fullUrl = getFullUrl(API_ENDPOINTS.CONFIG);
  console.log('Saving configuration to:', fullUrl);
  console.log('Configuration to save:', config);
  try {
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    console.log('Save response status:', response.status);

    if (!response.ok) {
      console.error('Failed to save configuration:', response.statusText);
      throw new Error(`Failed to save configuration: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Save result:', result);
    return result;
  } catch (error) {
    console.error('Error saving configuration:', error);
    throw error;
  }
}
