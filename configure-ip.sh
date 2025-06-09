#!/bin/bash

echo "🌐 Configuração Automática de IP - InfraAlert"
echo ""

# Detectar IP local no Mac/Linux
echo "🔍 Detectando IP local da máquina..."

# Tenta diferentes métodos para detectar o IP
LOCAL_IP=""

# Método 1: ifconfig (Mac/Linux)
if command -v ifconfig >/dev/null 2>&1; then
    LOCAL_IP=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -1)
fi

# Método 2: ip command (Linux)
if [ -z "$LOCAL_IP" ] && command -v ip >/dev/null 2>&1; then
    LOCAL_IP=$(ip route get 8.8.8.8 | grep -oP 'src \K[^ ]+' 2>/dev/null)
fi

# Método 3: hostname (Mac)
if [ -z "$LOCAL_IP" ] && command -v hostname >/dev/null 2>&1; then
    LOCAL_IP=$(hostname -I 2>/dev/null | awk '{print $1}')
fi

# Fallback
if [ -z "$LOCAL_IP" ]; then
    echo "❌ Não foi possível detectar o IP local"
    LOCAL_IP="192.168.1.1"
    echo "⚠️ Usando IP padrão: $LOCAL_IP"
else
    echo "✅ IP detectado: $LOCAL_IP"
fi

echo ""
echo "📝 Configurando arquivos..."

# Atualizar config.js
cat > frontend/config.js << EOF
// 🌐 URL da API Backend - Configurado automaticamente
// IP detectado: $LOCAL_IP
export const API_URL = 'http://$LOCAL_IP:3000';
EOF

echo "✅ config.js atualizado com IP: $LOCAL_IP"

# Testar conectividade
echo ""
echo "🧪 Testando conectividade..."
if ping -c 1 $LOCAL_IP >/dev/null 2>&1; then
    echo "✅ IP $LOCAL_IP responde"
else
    echo "⚠️ IP $LOCAL_IP não responde - verifique sua conexão"
fi

echo ""
echo "🚀 Configuração concluída!"
echo "📱 Execute 'npm start' no frontend para iniciar o app"
echo "🔧 Execute 'npm run dev' no backend para iniciar a API"
echo ""
