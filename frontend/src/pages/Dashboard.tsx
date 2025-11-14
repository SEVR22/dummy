import React, { useState } from 'react';
import MapComponent from '../components/Map/MapComponent';
import { IncidentType } from '../types';
import { Plus, Filter, AlertTriangle } from 'lucide-react';
import CreateIncidentModal from '../components/Incidents/CreateIncidentModal';

const Dashboard: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    incidentType: undefined as IncidentType | undefined,
    radiusKm: 10
  });

  const incidentTypes = [
    { value: 'assault', label: 'Asalto' },
    { value: 'robbery', label: 'Robo' },
    { value: 'homicide', label: 'Homicidio' },
    { value: 'accident', label: 'Accidente' },
    { value: 'fire', label: 'Incendio' },
    { value: 'natural_disaster', label: 'Desastre Natural' },
    { value: 'suspicious_activity', label: 'Actividad Sospechosa' },
    { value: 'other', label: 'Otro' }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header con controles */}
      <div className="bg-white shadow-sm border-b p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Mapa de Seguridad
          </h1>
          
          {/* Botón de filtros */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
          </button>
        </div>

        {/* Botón de emergencia y crear reporte */}
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
            <AlertTriangle className="h-5 w-5" />
            <span>EMERGENCIA</span>
          </button>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Reportar Incidente</span>
          </button>
        </div>
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <div className="bg-white border-b p-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Incidente
              </label>
              <select
                value={filters.incidentType || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  incidentType: e.target.value as IncidentType || undefined
                })}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Todos los tipos</option>
                {incidentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Radio (km)
              </label>
              <select
                value={filters.radiusKm}
                onChange={(e) => setFilters({
                  ...filters,
                  radiusKm: Number(e.target.value)
                })}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={20}>20 km</option>
                <option value={50}>50 km</option>
              </select>
            </div>

            <button
              onClick={() => setFilters({ incidentType: undefined, radiusKm: 10 })}
              className="mt-6 px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {/* Mapa */}
      <div className="flex-1">
        <MapComponent filters={filters} />
      </div>

      {/* Modal de crear incidente */}
      {showCreateModal && (
        <CreateIncidentModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            // TODO: Refrescar mapa
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
