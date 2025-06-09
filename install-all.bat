@echo off
REM ==============================================
REM INFRAALERT - INSTALAÇÃO COMPLETA
REM ==============================================

echo 🚀 InfraAlert - Instalação de Todas as Dependências
echo ===================================================
echo.

set ERRORS=0

echo 📦 [1/3] Instalando dependências do Backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erro na instalação do Backend
    set /a ERRORS+=1
) else (
    echo ✅ Backend instalado com sucesso
)
cd ..

echo.
echo 📱 [2/3] Instalando dependências do Frontend...
cd frontend
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ❌ Erro na instalação do Frontend
    set /a ERRORS+=1
) else (
    echo ✅ Frontend instalado com sucesso
)
cd ..

echo.
echo 🤖 [3/3] Configurando API Python (IA)...
cd backend\rota-segura-api

REM Criar ambiente virtual se não existir
if not exist "venv" (
    echo 🔧 Criando ambiente virtual Python...
    python -m venv venv
)

REM Ativar ambiente e instalar dependências
echo 📦 Instalando dependências Python...
call venv\Scripts\activate.bat && pip install -r requirements.txt --quiet
if %errorlevel% neq 0 (
    echo ❌ Erro na instalação da API Python
    set /a ERRORS+=1
) else (
    echo ✅ API Python configurada com sucesso
)
cd ..\..

echo.
echo ===============================================
if %ERRORS% equ 0 (
    echo ✅ INSTALAÇÃO COMPLETA COM SUCESSO!
    echo.
    echo 🚀 Próximos passos:
    echo    1. Execute: dev-all.bat
    echo    2. Ou execute cada serviço separadamente:
    echo       - Backend:     cd backend ^&^& npm run dev
    echo       - Frontend:    cd frontend ^&^& npm start
    echo       - API Python:  cd backend\rota-segura-api ^&^& start.bat
) else (
    echo ❌ INSTALAÇÃO FALHOU!
    echo Encontrados %ERRORS% erro(s). Verifique as mensagens acima.
)
echo ===============================================
echo.
pause
