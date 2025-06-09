@echo off
REM ==============================================
REM INFRAALERT - INICIAR API PYTHON (IA)
REM ==============================================

echo 🤖 Iniciando API Python - InfraAlert IA
echo ========================================

REM Verificar se venv existe
if not exist "venv\Scripts\activate.bat" (
    echo ❌ Ambiente virtual não encontrado!
    echo 🔧 Criando ambiente virtual...
    python -m venv venv
    echo ✅ Ambiente virtual criado!
)

REM Ativar ambiente virtual e executar API
echo 🔄 Ativando ambiente virtual...
call venv\Scripts\activate.bat

echo 📦 Verificando dependências...
pip install -r requirements.txt --quiet

echo 🚀 Iniciando servidor Python...
echo 📍 API rodando em: http://localhost:5000
echo.

python src\main.py
