import { MESSAGES } from './config-variables.js';

export function showMessage(message, isError = false) {
  const messageElement = document.getElementById('message');
  messageElement.textContent = message;
  messageElement.className = `mt-4 text-center font-bold ${
    isError ? 'text-red-600' : 'text-green-600'
  }`;
}

export function hideMessage() {
  const messageElement = document.getElementById('message');
  messageElement.textContent = '';
  messageElement.className = '';
}

export function showLoadingError() {
  showMessage(MESSAGES.LOAD_ERROR, true);
}

export function showSaveError(error) {
  showMessage(MESSAGES.SAVE_ERROR + error.message, true);
}

export function showSaveSuccess() {
  showMessage(MESSAGES.CONFIG_SAVED);
}
