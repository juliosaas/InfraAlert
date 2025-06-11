import requests
import json

def test_python_api():
    """Teste simples da API Python"""
    url = "http://localhost:5050/api/routing/calculate-route"
    
    data = {
        "start_address": "Rua das Amoreiras, 123, Campinas",
        "end_address": "Rua Abolição, 456, Campinas", 
        "current_time": "14:30"
    }
    
    print("🚀 Testando API Python...")
    print(f"📍 URL: {url}")
    print(f"📤 Dados: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(url, json=data, timeout=60)
        print(f"📥 Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Sucesso!")
            print(f"📊 Response: {json.dumps(result, indent=2)}")
        else:
            print(f"❌ Erro: {response.text}")
            
    except Exception as e:
        print(f"❌ Exceção: {e}")

if __name__ == "__main__":
    test_python_api()
