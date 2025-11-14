import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthToken, LoginRequest, RegisterRequest } from '../types';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token guardado al cargar la aplicación
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      // TODO: Verificar token y obtener datos del usuario
      fetchCurrentUser(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const userData = await authAPI.getCurrentUser(authToken);
      setUser(userData);
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response: AuthToken = await authAPI.login(credentials);
      
      setToken(response.access_token);
      localStorage.setItem('token', response.access_token);
      
      await fetchCurrentUser(response.access_token);
      
      toast.success('¡Bienvenido!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Error al iniciar sesión');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      const newUser = await authAPI.register(userData);
      
      // Después del registro, hacer login automático
      await login({
        username: userData.username,
        password: userData.password
      });
      
      toast.success('¡Cuenta creada exitosamente!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Error al crear cuenta');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    toast.success('Sesión cerrada');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
