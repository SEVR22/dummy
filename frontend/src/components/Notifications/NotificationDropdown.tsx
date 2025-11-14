import React from 'react';
import { Link } from 'react-router-dom';
import { Notification, NotificationType } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  AlertTriangle, 
  Users, 
  Shield, 
  MessageCircle, 
  Info,
  X 
} from 'lucide-react';

interface NotificationDropdownProps {
  notifications: Notification[];
  onClose: () => void;
}

const getNotificationIcon = (type: NotificationType) => {
  const iconMap = {
    incident_nearby: AlertTriangle,
    friend_incident: Users,
    official_alert: Shield,
    comment_reply: MessageCircle,
    system: Info
  };
  
  return iconMap[type] || Info;
};

const getNotificationColor = (type: NotificationType) => {
  const colorMap = {
    incident_nearby: 'text-red-600',
    friend_incident: 'text-blue-600',
    official_alert: 'text-yellow-600',
    comment_reply: 'text-green-600',
    system: 'text-gray-600'
  };
  
  return colorMap[type] || 'text-gray-600';
};

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onClose
}) => {
  const recentNotifications = notifications.slice(0, 10);

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Notificaciones
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Lista de notificaciones */}
      <div className="max-h-96 overflow-y-auto">
        {recentNotifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Info className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No hay notificaciones</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentNotifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.notification_type);
              const iconColor = getNotificationColor(notification.notification_type);
              const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
                addSuffix: true,
                locale: es
              });

              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.is_read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 ${iconColor}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${
                          !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </p>
                        <span className="text-xs text-gray-500">
                          {timeAgo}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      
                      {notification.incident_id && (
                        <Link
                          to={`/incident/${notification.incident_id}`}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block"
                          onClick={onClose}
                        >
                          Ver incidente →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 10 && (
        <div className="p-3 border-t border-gray-200 text-center">
          <button
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            onClick={onClose}
          >
            Ver todas las notificaciones
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
