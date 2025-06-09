@echo off
REM ==============================================
REM INFRAALERT - VALIDACAO DO AMBIENTE
REM ==============================================

echo 🔍 InfraAlert - Validacao do Ambiente
echo ========================================
echo.

set ERRORS=0

REM Verificar Node.js
echo 📦 Verificando Node.js...
node -v >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node -v') do echo ✅ Node.js %%i encontrado
) else (
    echo ❌ Node.js nao encontrado
    set /a ERRORS+=1
)

REM Verificar npm
echo 📦 Verificando npm...
npm -v >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm -v') do echo ✅ npm %%i encontrado
) else (
    echo ❌ npm nao encontrado
    set /a ERRORS+=1
)

REM Verificar Python
echo 🐍 Verificando Python...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('python --version') do echo ✅ %%i encontrado
) else (
    echo ❌ Python nao encontrado
    set /a ERRORS+=1
)

REM Verificar Expo CLI
echo 📱 Verificando Expo CLI...
npx expo --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Expo CLI encontrado
) else (
    echo ⚠️  Expo CLI nao encontrado - instale com: npm install -g @expo/cli
)

echo.
echo 📁 Verificando estrutura do projeto...

REM Verificar backend
if exist "backend\package.json" (
    echo ✅ Backend encontrado
) else (
    echo ❌ Backend nao encontrado
    set /a ERRORS+=1
)

REM Verificar frontend
if exist "frontend\package.json" (
    echo ✅ Frontend encontrado
) else (
    echo ❌ Frontend nao encontrado
    set /a ERRORS+=1
)

REM Verificar API Python
if exist "backend\rota-segura-api\requirements.txt" (
    echo ✅ API Python encontrada
) else (
    echo ❌ API Python nao encontrada
    set /a ERRORS+=1
)

echo.
echo 🔧 Verificando configuracoes...

REM Verificar .env
if exist "backend\.env" (
    echo ✅ Arquivo .env encontrado
) else (
    echo ⚠️  Arquivo .env nao encontrado - copie de .env.example
)

REM Verificar node_modules do backend
if exist "backend\node_modules" (
    echo ✅ Dependencias do backend instaladas
) else (
    echo ⚠️  Dependencias do backend nao instaladas - execute: cd backend && npm install
)

REM Verificar node_modules do frontend
if exist "frontend\node_modules" (
    echo ✅ Dependencias do frontend instaladas
) else (
    echo ⚠️  Dependencias do frontend nao instaladas - execute: cd frontend && npm install
)

REM Verificar venv Python
if exist "backend\rota-segura-api\venv" (
    echo ✅ Ambiente virtual Python encontrado
) else (
    echo ⚠️  Ambiente virtual Python nao encontrado - execute: cd backend\rota-segura-api && python -m venv venv
)

echo.
echo 🌐 Verificando conectividade...

REM Testar portas
netstat -ano | findstr :3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Porta 3000 esta em uso
) else (
    echo ✅ Porta 3000 disponivel
)

netstat -ano | findstr :5000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Porta 5000 esta em uso
) else (
    echo ✅ Porta 5000 disponivel
)

echo.
echo 📊 Verificando IP local...
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr "IPv4"') do (
    for /f "tokens=1" %%j in ("%%i") do echo 🌐 IP Local: %%j
)

echo.
echo =======================================
if %ERRORS% equ 0 (
    echo ✅ VALIDACAO CONCLUIDA COM SUCESSO!
    echo Todos os requisitos estao atendidos.
    echo.
    echo 🚀 PROXIMOS PASSOS:
    echo 1. Configure o arquivo backend\.env
    echo 2. Configure o IP no frontend\config.js
    echo 3. Execute: cd backend ^&^& npm run dev
    echo 4. Execute: cd frontend ^&^& npm start
) else (
    echo ❌ VALIDACAO FALHOU!
    echo Encontrados %ERRORS% problema(s).
    echo Corrija os erros acima antes de continuar.
)

echo =======================================
echo.
pause
