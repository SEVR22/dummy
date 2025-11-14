# Sistema de Seguridad Nacional - El Salvador

Aplicación web para reportes ciudadanos de incidentes de seguridad con integración de autoridades.

## Estructura del Proyecto

```
hackaton-seguridad-sv/
├── backend/          # API FastAPI
├── frontend/         # React App
└── docs/            # Documentación
```

## Tecnologías

- **Backend:** FastAPI + SQLAlchemy + PostgreSQL + PostGIS
- **Frontend:** React + TypeScript + Leaflet Maps
- **Base de datos:** PostgreSQL con extensión PostGIS

## Instalación y Configuración

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Funcionalidades Principales

- 📍 Reportes ciudadanos geolocalizados
- 🚨 Notificaciones en tiempo real
- 👮 Dashboards para autoridades
- 👥 Sistema de amigos y seguimiento
- 📊 Análisis y estadísticas de seguridad
