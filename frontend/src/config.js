export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  chat: `${API_URL}/api/chat`,
  search: `${API_URL}/api/search`,
  documentation: `${API_URL}/api/documentation`,
  runPython: `${API_URL}/api/run-python`
};

export const CHAT_CONFIG = {
  historyMessages: 3 // Количество последних сообщений пользователя в истории
}; 