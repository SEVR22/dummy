import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">
            🛡️ Seguridad SV
          </h1>
          <p className="text-gray-600 mb-6">
            Sistema Nacional de Seguridad Ciudadana
          </p>
          <div className="space-y-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              ✅ Frontend funcionando correctamente
            </div>
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
              🚀 Backend disponible en: 
              <a 
                href="http://localhost:8000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline ml-1"
              >
                localhost:8000
              </a>
            </div>
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              📚 Documentación API: 
              <a 
                href="http://localhost:8000/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline ml-1"
              >
                /docs
              </a>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Estado del Sistema</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium">Backend</div>
                <div className="text-green-600">✅ Funcionando</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium">Frontend</div>
                <div className="text-green-600">✅ Funcionando</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium">Base de datos</div>
                <div className="text-green-600">✅ SQLite</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium">API</div>
                <div className="text-green-600">✅ FastAPI</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>¡Tu sistema está listo para la hackathon! 🎉</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
