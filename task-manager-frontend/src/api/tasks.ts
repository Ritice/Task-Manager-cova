import apiClient from './client';
import type { Task, TaskInput, TaskStatus } from '../types';

export interface TaskQuery {
  status?: TaskStatus;
  search?: string;
}

export async function fetchTasks(query: TaskQuery = {}): Promise<Task[]> {
  const params: Record<string, string> = {};
  if (query.status) params.status = query.status;
  if (query.search) params.search = query.search;

  const response = await apiClient.get<Task[]>('/tasks', { params });
  return response.data;
}

export async function createTaskRequest(data: TaskInput): Promise<Task> {
  const response = await apiClient.post<Task>('/tasks', data);
  return response.data;
}

export async function updateTaskRequest(id: number, data: TaskInput): Promise<Task> {
  const response = await apiClient.put<Task>(`/tasks/${id}`, data);
  return response.data;
}

export async function deleteTaskRequest(id: number): Promise<void> {
  await apiClient.delete(`/tasks/${id}`);
}
