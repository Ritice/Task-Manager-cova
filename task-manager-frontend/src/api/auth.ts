import apiClient from './client';
import type { AuthResponse, LoginInput, RegisterInput } from '../types';

export async function registerRequest(data: RegisterInput): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/register', data);
  return response.data;
}

export async function loginRequest(data: LoginInput): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  return response.data;
}
