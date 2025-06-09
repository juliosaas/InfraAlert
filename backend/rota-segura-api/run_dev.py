#!/usr/bin/env python3
"""
InfraAlert - Script de desenvolvimento da API Python
Executa: venv\Scripts\activate && python src\main.py
"""

import subprocess
import sys
import os
from pathlib import Path

def run_api():
    """Executa a API Python com ambiente virtual ativado"""
    
    # Verificar se estamos no diretório correto
    if not Path("src/main.py").exists():
        print("❌ Erro: Execute este script no diretório rota-segura-api")
        sys.exit(1)
    
    # Verificar se venv existe
    if not Path("venv/Scripts/activate.bat").exists():
        print("🔧 Criando ambiente virtual...")
        subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
        print("✅ Ambiente virtual criado!")
    
    print("🤖 Iniciando API Python - InfraAlert IA")
    print("📍 API rodando em: http://localhost:5000")
    print("=" * 40)
    
    # Executar no Windows
    if os.name == 'nt':
        # Windows
        cmd = 'call venv\\Scripts\\activate.bat && python src\\main.py'
        subprocess.run(cmd, shell=True)
    else:
        # Linux/Mac
        cmd = 'source venv/bin/activate && python src/main.py'
        subprocess.run(cmd, shell=True, executable='/bin/bash')

if __name__ == "__main__":
    try:
        run_api()
    except KeyboardInterrupt:
        print("\n🛑 API Python finalizada pelo usuário")
    except Exception as e:
        print(f"❌ Erro ao executar API: {e}")
        sys.exit(1)
