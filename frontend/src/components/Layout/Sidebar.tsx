import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Map, 
  AlertTriangle, 
  Users, 
  FileText, 
  BarChart3, 
  Settings
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    {
      name: 'Mapa Principal',
      path: '/',
      icon: Map,
      roles: ['citizen', 'police', 'red_cross', 'civil_protection', 'admin']
    },
    {
      name: 'Reportes Oficiales',
      path: '/official-reports',
      icon: FileText,
      roles: ['police', 'red_cross', 'civil_protection', 'admin']
    },
    {
      name: 'Mis Amigos',
      path: '/friends',
      icon: Users,
      roles: ['citizen', 'police', 'red_cross', 'civil_protection', 'admin']
    },
    {
      name: 'Estadísticas',
      path: '/analytics',
      icon: BarChart3,
      roles: ['police', 'civil_protection', 'admin']
    },
    {
      name: 'Configuración',
      path: '/settings',
      icon: Settings,
      roles: ['citizen', 'police', 'red_cross', 'civil_protection', 'admin']
    }
  ];

  const visibleItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Navegación
        </h2>
        
        <nav className="space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Información del usuario */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {user?.full_name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
