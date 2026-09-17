import axios, { AxiosError } from 'axios';
import { getToken, clearSession } from '../utils/storage';
import type { ApiErrorPayload } from '../types';

export const AUTH_LOGOUT_EVENT = 'auth:logout';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    if (error.response?.status === 401) {
      clearSession();
      window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT));
    }
    return Promise.reject(error);
  }
);

export function extractErrorMessage(error: unknown, fallback = 'Une erreur est survenue'): string {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as ApiErrorPayload | undefined;
    if (payload?.message) return payload.message;
    if (error.message) return error.message;
  }
  return fallback;
}

export function extractFieldErrors(error: unknown): Record<string, string> | undefined {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as ApiErrorPayload | undefined;
    return payload?.fieldErrors;
  }
  return undefined;
}

export default apiClient;
