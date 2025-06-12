#!/usr/bin/env python3
"""
Diagnóstico específico para el error "Error al iniciar la evaluación"
en la versión desplegada en Vercel
"""
import requests
import json
from datetime import datetime

def diagnose_vercel_error():
    print("🔍 DIAGNÓSTICO: Error al iniciar evaluación en Vercel")
    print("=" * 60)
    print(f"Timestamp: {datetime.now()}")
    print()
    
    # URLs a probar
    vercel_url = "https://assessment-platform-deploy.vercel.app"  # Nueva URL esperada
    backend_url = "https://assessment-platform-1nuo.onrender.com"
    
    print("🌐 STEP 1: Verificando accesibilidad de URLs")
    print("-" * 40)
    
    # Test Vercel frontend
    try:
        response = requests.get(vercel_url, timeout=10)
        if response.status_code == 200:
            print(f"✅ Vercel Frontend: ACCESSIBLE ({response.status_code})")
            print(f"   URL: {vercel_url}")
        else:
            print(f"❌ Vercel Frontend: ERROR ({response.status_code})")
    except Exception as e:
        print(f"❌ Vercel Frontend: ERROR - {e}")
    
    # Test backend
    try:
        response = requests.get(backend_url, timeout=10)
        if response.status_code == 200:
            print(f"✅ Render Backend: ACCESSIBLE ({response.status_code})")
        else:
            print(f"❌ Render Backend: ERROR ({response.status_code})")
    except Exception as e:
        print(f"❌ Render Backend: ERROR - {e}")
    
    print("\n🔧 STEP 2: Simulando flujo de startAssessment()")
    print("-" * 40)
    
    session = requests.Session()
    session.headers.update({
        'Origin': vercel_url,
        'Referer': vercel_url,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    })
    
    # Simular el flujo exacto de startAssessment()
    try:
        # Paso 1: Login automático
        print("1️⃣ Testing auto-login...")
        login_response = session.post(
            f"{backend_url}/api/login",
            json={"username": "admin", "password": "admin123"},
            timeout=10
        )
        print(f"   Login status: {login_response.status_code}")
        
        if login_response.status_code == 200:
            print("   ✅ Login exitoso")
            
            # Paso 2: Demographics
            print("2️⃣ Testing demographics...")
            demo_response = session.post(
                f"{backend_url}/api/demographics",
                json={
                    "name": "Test User",
                    "email": "test@example.com", 
                    "age": 25,
                    "gender": "masculino"
                },
                timeout=10
            )
            print(f"   Demographics status: {demo_response.status_code}")
            
            if demo_response.status_code == 200:
                print("   ✅ Demographics exitoso")
                print("   ✅ Flujo básico funciona - problema debe ser en frontend")
                
                # Paso 3: Verificar si las preguntas integradas están en el HTML
                print("3️⃣ Verificando preguntas integradas...")
                html_response = requests.get(vercel_url)
                html_content = html_response.text
                
                if "TEMP_QUESTIONS" in html_content:
                    print("   ✅ Preguntas integradas encontradas en HTML")
                else:
                    print("   ❌ Preguntas integradas NO encontradas en HTML")
                
                if "startAssessment" in html_content:
                    print("   ✅ Función startAssessment encontrada")
                else:
                    print("   ❌ Función startAssessment NO encontrada")
                    
            else:
                print(f"   ❌ Demographics falló: {demo_response.text}")
        else:
            print(f"   ❌ Login falló: {login_response.text}")
            
    except Exception as e:
        print(f"❌ Error en simulación: {e}")
    
    print("\n🔍 STEP 3: Verificando CORS y configuración")
    print("-" * 40)
    
    # Test CORS headers
    try:
        response = session.options(f"{backend_url}/api/login")
        cors_headers = {k: v for k, v in response.headers.items() if 'access-control' in k.lower()}
        print("CORS Headers:")
        for header, value in cors_headers.items():
            print(f"   {header}: {value}")
            
        if vercel_url.replace('https://', '') in response.headers.get('Access-Control-Allow-Origin', ''):
            print("   ✅ CORS configurado para esta URL")
        else:
            print("   ❌ CORS posiblemente mal configurado")
            
    except Exception as e:
        print(f"❌ Error verificando CORS: {e}")
    
    print("\n💡 STEP 4: Recomendaciones de debugging")
    print("-" * 40)
    print("Para diagnosticar el problema específico:")
    print("1. Abre las Dev Tools en el navegador (F12)")
    print("2. Ve a la pestaña Console")
    print("3. Intenta iniciar la evaluación")
    print("4. Busca errores específicos en la consola")
    print("5. Ve a la pestaña Network para ver qué requests fallan")
    print()
    print("Posibles causas del error:")
    print("• CORS: Backend no acepta requests desde tu URL de Vercel")
    print("• JavaScript: Error en la función startAssessment()")
    print("• Missing data: Preguntas integradas no están en el HTML")
    print("• API: Algún endpoint del backend está fallando")
    
    return True

if __name__ == "__main__":
    diagnose_vercel_error()
