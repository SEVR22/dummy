import React from 'react';
import { useParams } from 'react-router-dom';

const IncidentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Detalle del Incidente #{id}</h1>
      <p className="text-gray-600">Página en desarrollo...</p>
    </div>
  );
};

export default IncidentDetail;
