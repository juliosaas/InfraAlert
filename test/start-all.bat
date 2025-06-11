@echo off
REM ==============================================
REM INFRAALERT - INICIAR TODOS OS SERVIÇOS
REM ==============================================

echo 🚀 InfraAlert - Iniciando todos os serviços
echo =============================================
echo.

REM Verificar se as dependências estão instaladas
echo 🔍 Verificando dependências...

if not exist "backend\node_modules" (
    echo ❌ Backend não instalado! Execute: run install:backend
    pause
    exit /b 1
)

if not exist "frontend\node_modules" (
    echo ❌ Frontend não instalado! Execute: run install:frontend
    pause
    exit /b 1
)

if not exist "backend\rota-segura-api\venv" (
    echo ❌ Python não instalado! Execute: run install:python
    pause
    exit /b 1
)

echo ✅ Todas as dependências encontradas!
echo.

REM Criar terminais para cada serviço
echo 🔥 Abrindo terminais para cada serviço...
echo.

REM Terminal 1 - Backend
echo 🟦 Abrindo Backend (Node.js)...
start "InfraAlert - Backend" cmd /k "cd /d %CD%\backend && npm run dev"

REM Aguardar um pouco
timeout /t 2 /nobreak >nul

REM Terminal 2 - Python API
echo 🟨 Abrindo Python API (IA)...
start "InfraAlert - Python API" cmd /k "cd /d %CD%\backend\rota-segura-api && call venv\Scripts\activate && python src\main.py"

REM Aguardar um pouco
timeout /t 2 /nobreak >nul

REM Terminal 3 - Frontend
echo 🟩 Abrindo Frontend (React Native)...
start "InfraAlert - Frontend" cmd /k "cd /d %CD%\frontend && npm start"

echo.
echo ✅ Todos os serviços foram iniciados!
echo.
echo 📱 SERVIÇOS RODANDO:
echo   🟦 Backend:     http://localhost:3000
echo   🟨 Python API:  http://localhost:5000
echo   🟩 Frontend:    Expo Metro (escaneie o QR Code)
echo.
echo 💡 Para parar os serviços, feche os terminais ou pressione Ctrl+C
echo.
pause
