import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { Incident, IncidentType } from '../../types';
import { incidentAPI } from '../../services/api';
import { useQuery } from 'react-query';
import IncidentMarker from './IncidentMarker';
import 'leaflet/dist/leaflet.css';

// Configurar iconos por defecto de Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  center?: LatLngExpression;
  zoom?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  filters?: {
    incidentType?: IncidentType;
    radiusKm?: number;
  };
}

const MapComponent: React.FC<MapComponentProps> = ({
  center = [13.6929, -89.2182], // San Salvador, El Salvador
  zoom = 12,
  onLocationSelect,
  filters = {}
}) => {
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(center);

  // Obtener ubicación del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location: LatLngExpression = [latitude, longitude];
          setUserLocation(location);
          setMapCenter(location);
        },
        (error) => {
          console.warn('Error obteniendo ubicación:', error);
        }
      );
    }
  }, []);

  // Obtener incidentes
  const { data: incidents = [], isLoading, error } = useQuery(
    ['incidents', userLocation, filters],
    () => {
      if (!userLocation) return [];
      
      const [lat, lng] = userLocation as [number, number];
      return incidentAPI.getIncidents({
        latitude: lat,
        longitude: lng,
        radius_km: filters.radiusKm || 10,
        incident_type: filters.incidentType,
        limit: 100
      });
    },
    {
      enabled: !!userLocation,
      refetchInterval: 30000, // Actualizar cada 30 segundos
    }
  );

  const MapEvents: React.FC = () => {
    const map = useMap();
    
    useEffect(() => {
      if (onLocationSelect) {
        map.on('click', (e) => {
          onLocationSelect(e.latlng.lat, e.latlng.lng);
        });
      }
      
      return () => {
        map.off('click');
      };
    }, [map]);

    return null;
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <p className="text-red-600">Error cargando el mapa</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEvents />
        
        {/* Marcador de ubicación del usuario */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold">Tu ubicación</p>
                <p className="text-sm text-gray-600">Ubicación actual</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Marcadores de incidentes */}
        {incidents.map((incident) => (
          <IncidentMarker
            key={incident.id}
            incident={incident}
          />
        ))}
      </MapContainer>
      
      {/* Indicador de carga */}
      {isLoading && (
        <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">Cargando incidentes...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
