@echo off
REM ==============================================
REM INFRAALERT - DESENVOLVIMENTO API PYTHON
REM ==============================================

echo 🤖 InfraAlert - API Python em modo desenvolvimento
echo ================================================

REM Navegar para diretório da API Python
cd /d "%~dp0"

REM Ativar ambiente virtual e executar
call venv\Scripts\activate && python src\main.py
