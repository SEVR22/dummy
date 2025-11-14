import React from 'react';

interface CreateIncidentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateIncidentModal: React.FC<CreateIncidentModalProps> = ({ onClose, onSuccess }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Reportar Incidente</h2>
        <p className="text-gray-600 mb-4">Modal en desarrollo...</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
          <button
            onClick={onSuccess}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reportar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateIncidentModal;
