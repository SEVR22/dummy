# Configuración simple para pruebas
import os

# Variables de entorno para pruebas
os.environ["SECRET_KEY"] = "test-secret-key-for-development-only"
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "11520"
os.environ["BACKEND_CORS_ORIGINS"] = "http://localhost:3000"

print("✅ Variables de entorno configuradas para pruebas")
