import axios from 'axios';
import { Portfolio, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface PortfolioGenerationOptions {
  template: 'modern' | 'classic' | 'minimal';
  includeActivities: boolean;
  includeProjects: boolean;
  includeSkills: boolean;
  includeAchievements: boolean;
  isPublic: boolean;
}

export const getPortfolio = async (studentId?: string): Promise<Portfolio> => {
  try {
    const endpoint = studentId ? `/portfolios/${studentId}` : '/portfolios/me';
    const response = await api.get<ApiResponse<Portfolio>>(endpoint);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch portfolio');
  }
};

export const updatePortfolio = async (portfolioData: Partial<Portfolio>): Promise<Portfolio> => {
  try {
    const response = await api.put<ApiResponse<Portfolio>>('/portfolios/me', portfolioData);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update portfolio');
  }
};

export const generatePortfolioPDF = async (options: PortfolioGenerationOptions): Promise<Blob> => {
  try {
    const response = await api.post('/portfolios/me/generate-pdf', options, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to generate portfolio PDF');
  }
};

export const sharePortfolio = async (isPublic: boolean): Promise<{ shareUrl: string }> => {
  try {
    const response = await api.patch<ApiResponse<{ shareUrl: string }>>('/portfolios/me/share', {
      isPublic,
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update portfolio sharing settings');
  }
};

export const getPublicPortfolio = async (studentId: string): Promise<Portfolio> => {
  try {
    const response = await api.get<ApiResponse<Portfolio>>(`/portfolios/public/${studentId}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch public portfolio');
  }
};

export const addSkillToPortfolio = async (skill: {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
}): Promise<Portfolio> => {
  try {
    const response = await api.post<ApiResponse<Portfolio>>('/portfolios/me/skills', skill);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to add skill');
  }
};

export const addProjectToPortfolio = async (project: {
  title: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  status: 'ongoing' | 'completed' | 'paused';
  githubUrl?: string;
  demoUrl?: string;
}): Promise<Portfolio> => {
  try {
    const response = await api.post<ApiResponse<Portfolio>>('/portfolios/me/projects', project);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to add project');
  }
};

export const addAchievementToPortfolio = async (achievement: {
  title: string;
  description: string;
  date: string;
  issuer: string;
  certificateUrl?: string;
  category: string;
}): Promise<Portfolio> => {
  try {
    const response = await api.post<ApiResponse<Portfolio>>('/portfolios/me/achievements', achievement);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to add achievement');
  }
};
