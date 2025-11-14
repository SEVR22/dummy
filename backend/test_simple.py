#!/usr/bin/env python3
"""
Script simple para probar FastAPI sin base de datos
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Crear aplicación simple
app = FastAPI(
    title="Sistema Seguridad Nacional SV - Prueba",
    description="API de prueba para verificar funcionamiento",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "🚀 Sistema de Seguridad Nacional - El Salvador API",
        "status": "funcionando",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "El servidor está funcionando correctamente"
    }

@app.get("/test")
async def test_endpoint():
    return {
        "test": "exitoso",
        "data": {
            "usuarios": "✅ Endpoint funcionando",
            "incidentes": "✅ Endpoint funcionando", 
            "notificaciones": "✅ Endpoint funcionando"
        }
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Iniciando servidor de prueba...")
    print("📍 URL: http://localhost:8000")
    print("📚 Docs: http://localhost:8000/docs")
    print("🔍 Health: http://localhost:8000/health")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
