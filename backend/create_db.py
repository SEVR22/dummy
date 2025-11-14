#!/usr/bin/env python3
"""
Script para crear la base de datos y tablas iniciales
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.core.config import settings
from app.db.database import Base
from app.models import user, incident, comment, friendship, notification, media_file, official_report

def create_database():
    """Crear base de datos si no existe"""
    # Conectar sin especificar la base de datos
    engine_url = settings.SQLALCHEMY_DATABASE_URI.rsplit('/', 1)[0] + '/postgres'
    engine = create_engine(engine_url)
    
    with engine.connect() as conn:
        # Verificar si la base de datos existe
        result = conn.execute(text(f"SELECT 1 FROM pg_database WHERE datname = '{settings.POSTGRES_DB}'"))
        if not result.fetchone():
            # Crear la base de datos
            conn.execute(text("COMMIT"))
            conn.execute(text(f"CREATE DATABASE {settings.POSTGRES_DB}"))
            print(f"Base de datos '{settings.POSTGRES_DB}' creada exitosamente")
        else:
            print(f"Base de datos '{settings.POSTGRES_DB}' ya existe")

def create_tables():
    """Crear todas las tablas"""
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
    
    # Habilitar PostGIS si no está habilitado
    with engine.connect() as conn:
        try:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis"))
            conn.commit()
            print("Extensión PostGIS habilitada")
        except Exception as e:
            print(f"Advertencia: No se pudo habilitar PostGIS: {e}")
    
    # Crear todas las tablas
    Base.metadata.create_all(bind=engine)
    print("Tablas creadas exitosamente")

def create_admin_user():
    """Crear usuario administrador por defecto"""
    from sqlalchemy.orm import sessionmaker
    from app.models.user import User, UserRole
    from app.core.security import get_password_hash
    
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    try:
        # Verificar si ya existe un admin
        existing_admin = db.query(User).filter(User.role == UserRole.ADMIN).first()
        if existing_admin:
            print("Ya existe un usuario administrador")
            return
        
        # Crear usuario admin
        admin_user = User(
            email="admin@seguridad.sv",
            username="admin",
            full_name="Administrador Sistema",
            role=UserRole.ADMIN,
            hashed_password=get_password_hash("admin123"),
            is_active=True,
            is_verified=True
        )
        
        db.add(admin_user)
        db.commit()
        print("Usuario administrador creado:")
        print("  Email: admin@seguridad.sv")
        print("  Usuario: admin")
        print("  Contraseña: admin123")
        
    except Exception as e:
        print(f"Error creando usuario admin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("=== Configuración de Base de Datos ===")
    
    try:
        print("\n1. Creando base de datos...")
        create_database()
        
        print("\n2. Creando tablas...")
        create_tables()
        
        print("\n3. Creando usuario administrador...")
        create_admin_user()
        
        print("\n✅ Configuración completada exitosamente!")
        print("\nPuedes iniciar el servidor con:")
        print("uvicorn app.main:app --reload")
        
    except Exception as e:
        print(f"\n❌ Error durante la configuración: {e}")
        sys.exit(1)
