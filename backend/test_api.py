#!/usr/bin/env python3
"""
Script para probar la API básica
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Probar endpoint de salud"""
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"✅ Servidor funcionando: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Error conectando al servidor: {e}")
        return False

def test_docs():
    """Verificar documentación automática"""
    try:
        response = requests.get(f"{BASE_URL}/docs")
        if response.status_code == 200:
            print("✅ Documentación disponible en: http://localhost:8000/docs")
            return True
        else:
            print(f"❌ Error accediendo a documentación: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error verificando documentación: {e}")
        return False

def test_register():
    """Probar registro de usuario"""
    try:
        user_data = {
            "email": "test@ejemplo.com",
            "username": "testuser",
            "full_name": "Usuario de Prueba",
            "password": "test123",
            "role": "citizen"
        }
        
        response = requests.post(f"{BASE_URL}/api/v1/auth/register", json=user_data)
        
        if response.status_code == 200:
            print("✅ Registro de usuario exitoso")
            return response.json()
        else:
            print(f"❌ Error en registro: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error probando registro: {e}")
        return None

def test_login(username="admin", password="admin123"):
    """Probar inicio de sesión"""
    try:
        login_data = {
            "username": username,
            "password": password
        }
        
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        if response.status_code == 200:
            token_data = response.json()
            print(f"✅ Login exitoso para {username}")
            return token_data["access_token"]
        else:
            print(f"❌ Error en login: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error probando login: {e}")
        return None

def test_protected_endpoint(token):
    """Probar endpoint protegido"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/v1/users/me", headers=headers)
        
        if response.status_code == 200:
            user_data = response.json()
            print(f"✅ Endpoint protegido funcionando - Usuario: {user_data['username']}")
            return True
        else:
            print(f"❌ Error en endpoint protegido: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error probando endpoint protegido: {e}")
        return False

def main():
    print("=== Pruebas de la API ===\n")
    
    # 1. Probar conexión básica
    print("1. Probando conexión al servidor...")
    if not test_health():
        print("❌ El servidor no está funcionando. Asegúrate de que esté ejecutándose.")
        return
    
    # 2. Verificar documentación
    print("\n2. Verificando documentación...")
    test_docs()
    
    # 3. Probar login con admin
    print("\n3. Probando login con usuario admin...")
    token = test_login()
    
    if token:
        # 4. Probar endpoint protegido
        print("\n4. Probando endpoint protegido...")
        test_protected_endpoint(token)
    
    # 5. Probar registro de nuevo usuario
    print("\n5. Probando registro de nuevo usuario...")
    new_user = test_register()
    
    if new_user:
        # 6. Probar login con nuevo usuario
        print("\n6. Probando login con nuevo usuario...")
        new_token = test_login("testuser", "test123")
        
        if new_token:
            test_protected_endpoint(new_token)
    
    print("\n=== Pruebas completadas ===")
    print("\nSi todas las pruebas pasaron, tu API está funcionando correctamente!")
    print("Puedes acceder a la documentación en: http://localhost:8000/docs")

if __name__ == "__main__":
    main()
