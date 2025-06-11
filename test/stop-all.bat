@echo off
REM ==============================================
REM INFRAALERT - PARAR TODOS OS SERVIÇOS
REM ==============================================

echo 🛑 InfraAlert - Parando Todos os Serviços
echo ========================================
echo.

echo 🔍 Identificando processos...

REM Parar processos Node.js (Backend)
echo 🔧 Parando Backend Node.js...
taskkill /f /im node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend parado
) else (
    echo ⚠️  Backend não estava rodando
)

REM Parar processos Python (API)
echo 🤖 Parando API Python...
taskkill /f /im python.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ API Python parada
) else (
    echo ⚠️  API Python não estava rodando
)

REM Parar Metro (Frontend)
echo 📱 Parando Metro Bundler...
taskkill /f /im cmd.exe /fi "WINDOWTITLE eq InfraAlert*" >nul 2>&1

echo.
echo 🔍 Verificando portas...

REM Verificar porta 3000
netstat -ano | findstr :3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Porta 3000 ainda em uso
) else (
    echo ✅ Porta 3000 liberada
)

REM Verificar porta 5000
netstat -ano | findstr :5000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Porta 5000 ainda em uso
) else (
    echo ✅ Porta 5000 liberada
)

echo.
echo ✅ TODOS OS SERVIÇOS FORAM PARADOS!
echo.
echo 💡 Para iniciar novamente: dev-all.bat
echo.
pause
