import axios from 'axios';
import type { Module, TestExecution, AICommand, JiraDefect, TestStats} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 120 second timeout for slow operations
});

// Module API
export const moduleAPI = {
  getAll: async (): Promise<Module[]> => {
    const response = await api.get<Module[]>('/modules');
    return response.data;
  },
  
  getProgress: async (): Promise<any> => {
    const response = await api.get('/modules/progress');
    return response.data;
  },
  
  getStats: async (): Promise<TestStats> => {
    const response = await api.get<TestStats>('/modules/stats');
    return response.data;
  },
  
  getJiraUrl: async (moduleName: string): Promise<{ module: string; jiraUrl: string }> => {
    const response = await api.get(`/modules/${moduleName}/jira-url`);
    return response.data;
  },
  
  getModuleStories: async (moduleName: string): Promise<{ module: string; count: number; stories: any[] }> => {
    const response = await api.get(`/modules/${moduleName}/stories`);
    return response.data;
  },
  
  getModuleScenarios: async (moduleName: string): Promise<{ module: string; count: number; scenarios: any[]; source: string }> => {
    const response = await api.get(`/modules/${moduleName}/scenarios-from-files`);
    return response.data;
  },
};

// Test Execution API
export const testAPI = {
  runTests: async (
    moduleIds: string[], 
    headless: boolean = true,
    selectedScenarios?: Record<string, string[]>
  ): Promise<{ executionId: string }> => {
    const response = await api.post('/tests/run', { 
      modules: moduleIds,
      headless: headless,
      scenarios: selectedScenarios 
    });
    return response.data;
  },
  
  stopTests: async (executionId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/tests/stop/${executionId}`);
    return response.data;
  },
  
  getExecution: async (executionId: string): Promise<TestExecution> => {
    const response = await api.get<TestExecution>(`/tests/execution/${executionId}`);
    return response.data;
  },
  
  getAllExecutions: async (): Promise<TestExecution[]> => {
    const response = await api.get<TestExecution[]>('/tests/executions');
    return response.data;
  },
  
  getActiveExecution: async (): Promise<TestExecution | null> => {
    const response = await api.get<TestExecution | null>('/tests/active-execution');
    return response.data;
  },
  
  stopExecution: async (executionId: string): Promise<{ message: string; executionId: string; execution: TestExecution }> => {
    const response = await api.post(`/tests/execution/${executionId}/stop`);
    return response.data;
  },
};

// AI Command API
export const aiAPI = {
  sendCommand: async (command: string): Promise<AICommand> => {
    const response = await api.post<AICommand>('/ai/command', { command });
    return response.data;
  },
  
  generateTests: async (jiraStoryId: string): Promise<{ scenarios: string[] }> => {
    const response = await api.post('/ai/generate-tests', { storyId: jiraStoryId });
    return response.data;
  },
  
  getCommandHistory: async (): Promise<AICommand[]> => {
    const response = await api.get<AICommand[]>('/ai/history');
    return response.data;
  },
};

// Defect API
export const defectAPI = {
  createDefect: async (defect: JiraDefect): Promise<JiraDefect> => {
    const response = await api.post<JiraDefect>('/defects/create', defect);
    return response.data;
  },
  
  getDefects: async (moduleId?: string): Promise<JiraDefect[]> => {
    const url = moduleId ? `/defects?module=${moduleId}` : '/defects';
    const response = await api.get<JiraDefect[]>(url);
    return response.data;
  },
  
  uploadScreenshot: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{ url: string }>('/defects/screenshot', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default api;
