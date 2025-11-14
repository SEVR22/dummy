# Documentación de la API - Sistema de Seguridad Nacional SV

## Información General

- **URL Base:** `http://localhost:8000/api/v1`
- **Autenticación:** Bearer Token (JWT)
- **Formato:** JSON
- **Documentación Interactiva:** `http://localhost:8000/docs`

## Autenticación

### POST /auth/login
Iniciar sesión con credenciales de usuario.

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "access_token": "string",
  "token_type": "bearer"
}
```

### POST /auth/register
Registrar nuevo usuario en el sistema.

**Request:**
```json
{
  "email": "user@example.com",
  "username": "string",
  "full_name": "string",
  "phone": "string",
  "password": "string",
  "role": "citizen"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "string",
  "full_name": "string",
  "role": "citizen",
  "is_active": true,
  "is_verified": false,
  "created_at": "2024-01-01T00:00:00Z"
}
```

## Usuarios

### GET /users/me
Obtener información del usuario autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "string",
  "full_name": "string",
  "phone": "string",
  "role": "citizen",
  "is_active": true,
  "is_verified": false,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### PUT /users/me
Actualizar información del usuario autenticado.

**Request:**
```json
{
  "full_name": "string",
  "phone": "string"
}
```

### GET /users/friends
Obtener lista de amigos del usuario.

**Response:**
```json
[
  {
    "id": 2,
    "username": "friend1",
    "full_name": "Amigo Uno",
    "role": "citizen"
  }
]
```

### POST /users/friends/{friend_id}
Enviar solicitud de amistad.

**Response:**
```json
{
  "message": "Solicitud de amistad enviada"
}
```

## Incidentes

### GET /incidents
Obtener lista de incidentes con filtros opcionales.

**Query Parameters:**
- `latitude` (float): Latitud para búsqueda por proximidad
- `longitude` (float): Longitud para búsqueda por proximidad
- `radius_km` (float): Radio de búsqueda en kilómetros (default: 10)
- `incident_type` (string): Tipo de incidente a filtrar
- `skip` (int): Número de registros a omitir (default: 0)
- `limit` (int): Límite de registros (default: 100)

**Response:**
```json
[
  {
    "id": 1,
    "title": "Asalto en zona centro",
    "description": "Descripción del incidente",
    "incident_type": "assault",
    "status": "pending",
    "latitude": 13.6929,
    "longitude": -89.2182,
    "address": "Calle Principal, San Salvador",
    "is_anonymous": false,
    "is_verified": false,
    "severity_level": 3,
    "incident_datetime": "2024-01-01T12:00:00Z",
    "created_at": "2024-01-01T12:05:00Z",
    "reporter_id": 1
  }
]
```

### GET /incidents/{incident_id}
Obtener detalles de un incidente específico.

**Response:**
```json
{
  "id": 1,
  "title": "Asalto en zona centro",
  "description": "Descripción detallada del incidente",
  "incident_type": "assault",
  "status": "pending",
  "latitude": 13.6929,
  "longitude": -89.2182,
  "address": "Calle Principal, San Salvador",
  "is_anonymous": false,
  "is_verified": false,
  "severity_level": 3,
  "incident_datetime": "2024-01-01T12:00:00Z",
  "created_at": "2024-01-01T12:05:00Z",
  "reporter_id": 1,
  "comments": [],
  "media_files": []
}
```

### POST /incidents
Crear nuevo reporte de incidente.

**Request:**
```json
{
  "title": "string",
  "description": "string",
  "incident_type": "assault",
  "latitude": 13.6929,
  "longitude": -89.2182,
  "address": "string",
  "is_anonymous": false,
  "severity_level": 3,
  "incident_datetime": "2024-01-01T12:00:00Z"
}
```

### PUT /incidents/{incident_id}
Actualizar incidente (solo reportero o autoridades).

**Request:**
```json
{
  "status": "verified",
  "severity_level": 4
}
```

## Comentarios

### GET /comments/incidents/{incident_id}/comments
Obtener comentarios de un incidente.

**Response:**
```json
[
  {
    "id": 1,
    "content": "Contenido del comentario",
    "is_anonymous": false,
    "created_at": "2024-01-01T12:10:00Z",
    "incident_id": 1,
    "author_id": 2,
    "author": {
      "username": "user2",
      "full_name": "Usuario Dos"
    }
  }
]
```

### POST /comments/incidents/{incident_id}/comments
Crear comentario en un incidente.

**Request:**
```json
{
  "content": "string",
  "is_anonymous": false
}
```

## Notificaciones

### GET /notifications
Obtener notificaciones del usuario autenticado.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Incidente cercano",
    "message": "Se reportó un asalto cerca de tu ubicación",
    "notification_type": "incident_nearby",
    "is_read": false,
    "created_at": "2024-01-01T12:15:00Z",
    "user_id": 1,
    "incident_id": 1
  }
]
```

### PUT /notifications/{notification_id}/read
Marcar notificación como leída.

## Archivos Multimedia

### POST /media/upload/{incident_id}
Subir archivo multimedia a un incidente.

**Request:**
```
Content-Type: multipart/form-data
file: [archivo]
```

**Response:**
```json
{
  "id": 1,
  "filename": "generated_filename.jpg",
  "original_filename": "photo.jpg",
  "media_type": "image",
  "file_size": 1024000,
  "created_at": "2024-01-01T12:20:00Z"
}
```

### GET /media/{media_id}
Obtener archivo multimedia.

**Response:** Archivo binario

## Códigos de Estado HTTP

- **200 OK:** Solicitud exitosa
- **201 Created:** Recurso creado exitosamente
- **400 Bad Request:** Error en los datos enviados
- **401 Unauthorized:** Token de autenticación inválido o faltante
- **403 Forbidden:** Sin permisos para realizar la acción
- **404 Not Found:** Recurso no encontrado
- **422 Unprocessable Entity:** Error de validación de datos
- **500 Internal Server Error:** Error interno del servidor

## Tipos de Datos

### UserRole
```
"citizen" | "police" | "red_cross" | "civil_protection" | "admin"
```

### IncidentType
```
"assault" | "robbery" | "homicide" | "accident" | "fire" | "natural_disaster" | "suspicious_activity" | "other"
```

### IncidentStatus
```
"pending" | "verified" | "investigating" | "resolved" | "false_report"
```

### NotificationType
```
"incident_nearby" | "friend_incident" | "official_alert" | "comment_reply" | "system"
```

### MediaType
```
"image" | "audio" | "video"
```

## Ejemplos de Uso

### Flujo de Autenticación
```javascript
// 1. Registrar usuario
const registerResponse = await fetch('/api/v1/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'usuario@ejemplo.com',
    username: 'usuario123',
    full_name: 'Usuario Ejemplo',
    password: 'password123'
  })
});

// 2. Iniciar sesión
const loginResponse = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'username=usuario123&password=password123'
});

const { access_token } = await loginResponse.json();

// 3. Usar token en solicitudes posteriores
const userResponse = await fetch('/api/v1/users/me', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});
```

### Crear Reporte de Incidente
```javascript
const incidentResponse = await fetch('/api/v1/incidents', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  },
  body: JSON.stringify({
    title: 'Asalto en centro comercial',
    description: 'Se reportó un asalto a mano armada en el estacionamiento',
    incident_type: 'assault',
    latitude: 13.6929,
    longitude: -89.2182,
    address: 'Centro Comercial Metrocentro',
    severity_level: 4,
    incident_datetime: new Date().toISOString()
  })
});
```

### Obtener Incidentes Cercanos
```javascript
const incidentsResponse = await fetch(
  '/api/v1/incidents?latitude=13.6929&longitude=-89.2182&radius_km=5',
  {
    headers: { 'Authorization': `Bearer ${access_token}` }
  }
);

const incidents = await incidentsResponse.json();
```

## Límites y Restricciones

- **Rate Limiting:** 100 solicitudes por minuto por usuario
- **Tamaño de archivos:** Máximo 10MB por archivo
- **Tipos de archivo permitidos:** JPG, PNG, GIF, MP4, MP3, WAV
- **Longitud de texto:** Máximo 1000 caracteres para descripciones
- **Radio de búsqueda:** Máximo 100km para búsquedas geoespaciales

## WebSocket Events

### Conexión
```javascript
const socket = io('http://localhost:8000', {
  auth: { token: access_token }
});
```

### Eventos Disponibles
- `new_notification`: Nueva notificación para el usuario
- `incident_update`: Actualización de un incidente
- `friend_incident`: Incidente reportado por un amigo

### Ejemplo de Uso
```javascript
socket.on('new_notification', (notification) => {
  console.log('Nueva notificación:', notification);
});

socket.on('incident_update', (incident) => {
  console.log('Incidente actualizado:', incident);
});
```
