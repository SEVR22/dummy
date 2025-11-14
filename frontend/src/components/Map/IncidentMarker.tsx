import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Link } from 'react-router-dom';
import { Incident, IncidentType } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  AlertTriangle, 
  Car, 
  Flame, 
  Eye, 
  Zap,
  MapPin
} from 'lucide-react';

interface IncidentMarkerProps {
  incident: Incident;
}

const getIncidentIcon = (type: IncidentType, severity: number): Icon => {
  const colors = {
    assault: '#ef4444',
    robbery: '#f97316', 
    homicide: '#dc2626',
    accident: '#eab308',
    fire: '#f59e0b',
    natural_disaster: '#8b5cf6',
    suspicious_activity: '#6b7280',
    other: '#64748b'
  };

  const size = severity >= 4 ? 30 : severity >= 2 ? 25 : 20;
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${colors[type]}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="${colors[type]}" stroke="white" stroke-width="2"/>
        <circle cx="12" cy="12" r="6" fill="white"/>
      </svg>
    `)}`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size/2]
  });
};

const getIncidentTypeIcon = (type: IncidentType) => {
  const iconMap = {
    assault: AlertTriangle,
    robbery: AlertTriangle,
    homicide: AlertTriangle,
    accident: Car,
    fire: Flame,
    natural_disaster: Zap,
    suspicious_activity: Eye,
    other: MapPin
  };
  
  return iconMap[type] || MapPin;
};

const getIncidentTypeLabel = (type: IncidentType): string => {
  const labels = {
    assault: 'Asalto',
    robbery: 'Robo',
    homicide: 'Homicidio',
    accident: 'Accidente',
    fire: 'Incendio',
    natural_disaster: 'Desastre Natural',
    suspicious_activity: 'Actividad Sospechosa',
    other: 'Otro'
  };
  
  return labels[type] || 'Incidente';
};

const getSeverityColor = (severity: number): string => {
  if (severity >= 4) return 'text-red-600';
  if (severity >= 3) return 'text-orange-600';
  if (severity >= 2) return 'text-yellow-600';
  return 'text-green-600';
};

const IncidentMarker: React.FC<IncidentMarkerProps> = ({ incident }) => {
  const IconComponent = getIncidentTypeIcon(incident.incident_type);
  const typeLabel = getIncidentTypeLabel(incident.incident_type);
  const severityColor = getSeverityColor(incident.severity_level);
  
  const timeAgo = formatDistanceToNow(new Date(incident.created_at), {
    addSuffix: true,
    locale: es
  });

  return (
    <Marker
      position={[incident.latitude, incident.longitude]}
      icon={getIncidentIcon(incident.incident_type, incident.severity_level)}
    >
      <Popup className="incident-popup" maxWidth={300}>
        <div className="p-2">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <IconComponent className="h-5 w-5 text-gray-600" />
              <span className="font-semibold text-gray-900">{typeLabel}</span>
            </div>
            <span className={`text-xs font-medium ${severityColor}`}>
              Nivel {incident.severity_level}
            </span>
          </div>

          {/* Título */}
          <h3 className="font-bold text-lg text-gray-900 mb-2">
            {incident.title}
          </h3>

          {/* Descripción */}
          <p className="text-gray-700 text-sm mb-3 line-clamp-3">
            {incident.description}
          </p>

          {/* Metadatos */}
          <div className="space-y-1 mb-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Reportado {timeAgo}</span>
              {incident.is_verified && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Verificado
                </span>
              )}
            </div>
            
            {incident.address && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <MapPin className="h-3 w-3" />
                <span>{incident.address}</span>
              </div>
            )}
          </div>

          {/* Estado */}
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full ${
              incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
              incident.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
              incident.status === 'verified' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {incident.status === 'pending' && 'Pendiente'}
              {incident.status === 'verified' && 'Verificado'}
              {incident.status === 'investigating' && 'Investigando'}
              {incident.status === 'resolved' && 'Resuelto'}
              {incident.status === 'false_report' && 'Reporte Falso'}
            </span>
            
            <Link
              to={`/incident/${incident.id}`}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Ver detalles →
            </Link>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default IncidentMarker;
