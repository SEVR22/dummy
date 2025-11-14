// Tipos de usuario
export enum UserRole {
  CITIZEN = 'citizen',
  POLICE = 'police',
  RED_CROSS = 'red_cross',
  CIVIL_PROTECTION = 'civil_protection',
  ADMIN = 'admin'
}

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

// Tipos de incidentes
export enum IncidentType {
  ASSAULT = 'assault',
  ROBBERY = 'robbery',
  HOMICIDE = 'homicide',
  ACCIDENT = 'accident',
  FIRE = 'fire',
  NATURAL_DISASTER = 'natural_disaster',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  OTHER = 'other'
}

export enum IncidentStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  INVESTIGATING = 'investigating',
  RESOLVED = 'resolved',
  FALSE_REPORT = 'false_report'
}

export interface Incident {
  id: number;
  title: string;
  description: string;
  incident_type: IncidentType;
  status: IncidentStatus;
  latitude: number;
  longitude: number;
  address?: string;
  is_anonymous: boolean;
  is_verified: boolean;
  severity_level: number;
  incident_datetime: string;
  created_at: string;
  reporter_id?: number;
}

export interface IncidentCreate {
  title: string;
  description: string;
  incident_type: IncidentType;
  latitude: number;
  longitude: number;
  address?: string;
  is_anonymous: boolean;
  severity_level: number;
  incident_datetime: string;
}

// Tipos de comentarios
export interface Comment {
  id: number;
  content: string;
  is_anonymous: boolean;
  created_at: string;
  incident_id: number;
  author_id?: number;
  author?: User;
}

// Tipos de notificaciones
export enum NotificationType {
  INCIDENT_NEARBY = 'incident_nearby',
  FRIEND_INCIDENT = 'friend_incident',
  OFFICIAL_ALERT = 'official_alert',
  COMMENT_REPLY = 'comment_reply',
  SYSTEM = 'system'
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: NotificationType;
  is_read: boolean;
  created_at: string;
  user_id: number;
  incident_id?: number;
}

// Tipos de archivos multimedia
export enum MediaType {
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video'
}

export interface MediaFile {
  id: number;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  media_type: MediaType;
  mime_type: string;
  created_at: string;
  incident_id: number;
}

// Tipos de autenticación
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  full_name: string;
  phone?: string;
  password: string;
  role?: UserRole;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

// Tipos de filtros
export interface IncidentFilters {
  latitude?: number;
  longitude?: number;
  radius_km?: number;
  incident_type?: IncidentType;
  skip?: number;
  limit?: number;
}
