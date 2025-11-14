import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { Notification } from '../types';
import toast from 'react-hot-toast';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  notifications: Notification[];
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket debe ser usado dentro de un SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      // Conectar al servidor de WebSocket
      const newSocket = io('http://localhost:8000', {
        auth: {
          token: token
        }
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        console.log('Conectado al servidor WebSocket');
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Desconectado del servidor WebSocket');
      });

      // Escuchar notificaciones en tiempo real
      newSocket.on('new_notification', (notification: Notification) => {
        setNotifications(prev => [notification, ...prev]);
        
        // Mostrar toast para notificaciones importantes
        if (notification.notification_type === 'incident_nearby' || 
            notification.notification_type === 'official_alert') {
          toast(notification.message, {
            icon: '🚨',
            duration: 6000,
          });
        }
      });

      // Escuchar actualizaciones de incidentes
      newSocket.on('incident_update', (incident) => {
        console.log('Incidente actualizado:', incident);
        // TODO: Actualizar estado de incidentes en la aplicación
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      // Desconectar si no hay usuario autenticado
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [user, token]);

  const value: SocketContextType = {
    socket,
    isConnected,
    notifications
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
