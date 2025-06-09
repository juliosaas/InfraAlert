@echo off
echo 🌐 Configuracao Automatica de IP - InfraAlert
echo.

REM Detectar IP local do Windows
echo 🔍 Detectando IP local da maquina...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        set LOCAL_IP=%%b
        if not "%%b"=="127.0.0.1" (
            echo ✅ IP detectado: %%b
            goto :found_ip
        )
    )
)

:found_ip
if "%LOCAL_IP%"=="" (
    echo ❌ Nao foi possivel detectar o IP local
    set LOCAL_IP=192.168.1.1
    echo ⚠️ Usando IP padrao: %LOCAL_IP%
)

echo.
echo 📝 Configurando arquivos...

REM Atualizar config.js
echo // 🌐 URL da API Backend - Configurado automaticamente > frontend\config.js
echo // IP detectado: %LOCAL_IP% >> frontend\config.js
echo export const API_URL = 'http://%LOCAL_IP%:3000'; >> frontend\config.js

echo ✅ config.js atualizado com IP: %LOCAL_IP%

REM Testar conectividade
echo.
echo 🧪 Testando conectividade...
ping -n 1 %LOCAL_IP% >nul 2>&1
if %errorlevel%==0 (
    echo ✅ IP %LOCAL_IP% responde
) else (
    echo ⚠️ IP %LOCAL_IP% nao responde - verifique sua conexao
)

echo.
echo 🚀 Configuracao concluida!
echo 📱 Execute 'npm start' no frontend para iniciar o app
echo 🔧 Execute 'npm run dev' no backend para iniciar a API
echo.
pause
