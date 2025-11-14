# Guía de Instalación - Sistema de Seguridad Nacional SV

## Requisitos Previos

### Software Necesario
- **Python 3.9+** (para el backend)
- **Node.js 16+** y **npm** (para el frontend)
- **PostgreSQL 13+** con extensión **PostGIS**
- **Redis** (para cache y sesiones)
- **Git** (para control de versiones)

### Servicios Opcionales
- **Docker** (para despliegue containerizado)
- **Nginx** (para proxy reverso en producción)

## Configuración de Base de Datos

### 1. Instalar PostgreSQL y PostGIS

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib postgis

# Windows (usar PostgreSQL installer oficial)
# Descargar desde: https://www.postgresql.org/download/windows/

# macOS
brew install postgresql postgis
```

### 2. Crear Base de Datos

```sql
-- Conectar como superusuario postgres
sudo -u postgres psql

-- Crear base de datos
CREATE DATABASE seguridad_sv;

-- Crear usuario
CREATE USER seguridad_user WITH PASSWORD 'tu_password_seguro';

-- Otorgar permisos
GRANT ALL PRIVILEGES ON DATABASE seguridad_sv TO seguridad_user;

-- Conectar a la base de datos
\c seguridad_sv

-- Habilitar extensión PostGIS
CREATE EXTENSION postgis;

-- Verificar instalación
SELECT PostGIS_Version();
```

## Configuración del Backend

### 1. Clonar y Configurar

```bash
# Navegar al directorio del backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows
venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

### 2. Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar .env con tus configuraciones
nano .env
```

Configurar las siguientes variables:

```env
# Base de datos
POSTGRES_SERVER=localhost
POSTGRES_USER=seguridad_user
POSTGRES_PASSWORD=tu_password_seguro
POSTGRES_DB=seguridad_sv
POSTGRES_PORT=5432

# Seguridad
SECRET_KEY=tu-clave-secreta-muy-segura-cambiar-en-produccion
ACCESS_TOKEN_EXPIRE_MINUTES=11520

# Redis
REDIS_URL=redis://localhost:6379

# CORS
BACKEND_CORS_ORIGINS=http://localhost:3000
```

### 3. Ejecutar Migraciones

```bash
# Inicializar Alembic (solo la primera vez)
alembic init alembic

# Crear migración inicial
alembic revision --autogenerate -m "Initial migration"

# Aplicar migraciones
alembic upgrade head
```

### 4. Ejecutar Backend

```bash
# Modo desarrollo
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# O usando el script principal
python main.py
```

El backend estará disponible en: `http://localhost:8000`
Documentación API: `http://localhost:8000/docs`

## Configuración del Frontend

### 1. Instalar Dependencias

```bash
# Navegar al directorio del frontend
cd frontend

# Instalar dependencias
npm install
```

### 2. Variables de Entorno

```bash
# Crear archivo de entorno (opcional)
echo "REACT_APP_API_URL=http://localhost:8000/api/v1" > .env
```

### 3. Ejecutar Frontend

```bash
# Modo desarrollo
npm start
```

El frontend estará disponible en: `http://localhost:3000`

## Configuración de Redis

### Instalar Redis

```bash
# Ubuntu/Debian
sudo apt install redis-server

# Windows (usar Redis para Windows)
# Descargar desde: https://github.com/microsoftarchive/redis/releases

# macOS
brew install redis
```

### Ejecutar Redis

```bash
# Iniciar servicio
redis-server

# Verificar funcionamiento
redis-cli ping
# Debe responder: PONG
```

## Verificación de Instalación

### 1. Verificar Backend

```bash
# Probar endpoint de salud
curl http://localhost:8000/

# Debe responder: {"message": "Sistema de Seguridad Nacional - El Salvador API"}
```

### 2. Verificar Frontend

- Abrir `http://localhost:3000` en el navegador
- Debe cargar la página de login
- Verificar que no hay errores en la consola del navegador

### 3. Verificar Base de Datos

```sql
-- Conectar a la base de datos
psql -h localhost -U seguridad_user -d seguridad_sv

-- Verificar tablas creadas
\dt

-- Debe mostrar las tablas: users, incidents, comments, etc.
```

## Datos de Prueba (Opcional)

### Crear Usuario Administrador

```python
# Ejecutar en el backend
python -c "
from app.db.database import SessionLocal
from app.models.user import User, UserRole
from app.core.security import get_password_hash

db = SessionLocal()
admin_user = User(
    email='admin@seguridad.sv',
    username='admin',
    full_name='Administrador Sistema',
    role=UserRole.ADMIN,
    hashed_password=get_password_hash('admin123'),
    is_active=True,
    is_verified=True
)
db.add(admin_user)
db.commit()
print('Usuario administrador creado')
"
```

## Solución de Problemas Comunes

### Error de Conexión a PostgreSQL

```bash
# Verificar que PostgreSQL esté ejecutándose
sudo systemctl status postgresql

# Iniciar si no está activo
sudo systemctl start postgresql
```

### Error de PostGIS

```sql
-- Si PostGIS no está disponible
CREATE EXTENSION IF NOT EXISTS postgis;
```

### Error de CORS en Frontend

- Verificar que `BACKEND_CORS_ORIGINS` incluya `http://localhost:3000`
- Reiniciar el servidor backend después de cambiar variables de entorno

### Error de Dependencias de Python

```bash
# Actualizar pip
pip install --upgrade pip

# Reinstalar dependencias
pip install -r requirements.txt --force-reinstall
```

### Error de Leaflet en Frontend

```bash
# Limpiar cache de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## Próximos Pasos

1. **Configurar autenticación OAuth** (Google, Facebook)
2. **Implementar notificaciones push**
3. **Configurar monitoreo** (Sentry, New Relic)
4. **Configurar CI/CD** (GitHub Actions, GitLab CI)
5. **Implementar tests automatizados**
6. **Configurar backup automático de base de datos**

## Contacto y Soporte

Para problemas técnicos o preguntas sobre la instalación:
- Crear issue en el repositorio del proyecto
- Contactar al equipo de desarrollo
