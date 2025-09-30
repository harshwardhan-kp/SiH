import axios from 'axios';
import { Activity, ActivityFormData, ApiResponse, Analytics } from '../types';

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

export const getActivities = async (filters?: any): Promise<Activity[]> => {
  try {
    const response = await api.get<ApiResponse<Activity[]>>('/activities', { params: filters });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch activities');
  }
};

export const getActivity = async (id: string): Promise<Activity> => {
  try {
    const response = await api.get<ApiResponse<Activity>>(`/activities/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch activity');
  }
};

export const createActivity = async (data: ActivityFormData): Promise<Activity> => {
  try {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(data).forEach(key => {
      if (key !== 'certificates' && key !== 'images') {
        formData.append(key, (data as any)[key]);
      }
    });

    // Append files
    if (data.certificates) {
      Array.from(data.certificates).forEach(file => {
        formData.append('certificates', file);
      });
    }

    if (data.images) {
      Array.from(data.images).forEach(file => {
        formData.append('images', file);
      });
    }

    const response = await api.post<ApiResponse<Activity>>('/activities', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create activity');
  }
};

export const updateActivity = async (id: string, data: Partial<ActivityFormData>): Promise<Activity> => {
  try {
    const response = await api.put<ApiResponse<Activity>>(`/activities/${id}`, data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update activity');
  }
};

export const deleteActivity = async (id: string): Promise<void> => {
  try {
    await api.delete(`/activities/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete activity');
  }
};

export const approveActivity = async (id: string): Promise<Activity> => {
  try {
    const response = await api.patch<ApiResponse<Activity>>(`/activities/${id}/approve`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to approve activity');
  }
};

export const rejectActivity = async (id: string, reason: string): Promise<Activity> => {
  try {
    const response = await api.patch<ApiResponse<Activity>>(`/activities/${id}/reject`, { reason });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to reject activity');
  }
};

export const getAnalytics = async (): Promise<Analytics> => {
  try {
    const response = await api.get<ApiResponse<Analytics>>('/analytics');
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch analytics');
  }
};