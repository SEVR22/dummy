import axios from 'axios';
import { 
  User, 
  AuthToken, 
  LoginRequest, 
  RegisterRequest, 
  Incident, 
  IncidentCreate, 
  IncidentFilters,
  Comment,
  Notification
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Configurar axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API de autenticación
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<AuthToken> => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<User> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async (token: string): Promise<User> => {
    const response = await api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

// API de usuarios
export const userAPI = {
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.put('/users/me', userData);
    return response.data;
  },

  getFriends: async (): Promise<User[]> => {
    const response = await api.get('/users/friends');
    return response.data;
  },

  sendFriendRequest: async (friendId: number): Promise<any> => {
    const response = await api.post(`/users/friends/${friendId}`);
    return response.data;
  },
};

// API de incidentes
export const incidentAPI = {
  getIncidents: async (filters: IncidentFilters = {}): Promise<Incident[]> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/incidents?${params.toString()}`);
    return response.data;
  },

  getIncidentById: async (id: number): Promise<Incident> => {
    const response = await api.get(`/incidents/${id}`);
    return response.data;
  },

  createIncident: async (incidentData: IncidentCreate): Promise<Incident> => {
    const response = await api.post('/incidents', incidentData);
    return response.data;
  },

  updateIncident: async (id: number, updateData: Partial<Incident>): Promise<Incident> => {
    const response = await api.put(`/incidents/${id}`, updateData);
    return response.data;
  },
};

// API de comentarios
export const commentAPI = {
  getComments: async (incidentId: number): Promise<Comment[]> => {
    const response = await api.get(`/comments/incidents/${incidentId}/comments`);
    return response.data;
  },

  createComment: async (incidentId: number, content: string, isAnonymous: boolean = false): Promise<Comment> => {
    const response = await api.post(`/comments/incidents/${incidentId}/comments`, {
      content,
      is_anonymous: isAnonymous,
    });
    return response.data;
  },
};

// API de notificaciones
export const notificationAPI = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await api.get('/notifications');
    return response.data;
  },

  markAsRead: async (notificationId: number): Promise<void> => {
    await api.put(`/notifications/${notificationId}/read`);
  },
};

// API de archivos multimedia
export const mediaAPI = {
  uploadFile: async (incidentId: number, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/media/upload/${incidentId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMediaUrl: (mediaId: number): string => {
    return `${API_BASE_URL}/media/${mediaId}`;
  },
};

export default api;
