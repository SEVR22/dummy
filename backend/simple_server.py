#!/usr/bin/env python3
"""
Servidor súper simple para probar
"""
from fastapi import FastAPI
import uvicorn

# Crear aplicación mínima
app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hola desde FastAPI!", "status": "funcionando"}

@app.get("/test")
def test():
    return {"test": "exitoso", "servidor": "funcionando correctamente"}

if __name__ == "__main__":
    print("🚀 Iniciando servidor simple...")
    print("📍 Abre tu navegador en: http://localhost:8000")
    print("📍 Prueba también: http://localhost:8000/test")
    print("📚 Documentación: http://localhost:8000/docs")
    print("\n⏹️  Para detener el servidor, presiona Ctrl+C")
    
    uvicorn.run(
        app, 
        host="127.0.0.1", 
        port=8000, 
        log_level="info"
    )
