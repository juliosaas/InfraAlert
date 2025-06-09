# 🚨 InfraAlert - Sistema de Rotas Seguras

<div align="center">
  <img src="frontend/assets/img/InfraAlertLogo.png" alt="InfraAlert Logo" width="200"/>
  
  **Sistema inteligente para cálculo de rotas seguras com análise de infraestrutura em tempo real**
  
  [![React Native](https://img.shields.io/badge/React%20Native-61DAFB?style=flat&logo=react&logoColor=black)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)](https://python.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)](https://postgresql.org/)
</div>

## 📑 Sumário

- [📋 Pré-Requisitos](#-pré-requisitos)
- [🚀 Início Rápido (RECOMENDADO)](#-início-rápido-recomendado)
- [📦 Instalação Manual (AVANÇADO)](#-instalação-manual-avançado)
- [⚙️ Configurações Importantes](#️-configurações-importantes)
- [🎯 Execução Individual (AVANÇADO)](#-execução-individual-avançado)
- [🛠️ Comandos Úteis](#️-comandos-úteis)
- [🚨 Solução de Problemas](#-solução-de-problemas)

---

## 📋 PRÉ-REQUISITOS

### Essenciais
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Python 3.9+** - [Download](https://python.org/)
- **Git** - [Download](https://git-scm.com/)

### Para o App Mobile
- **Expo CLI**: `npm install -g @expo/cli`
- **Expo Go** no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Verificar Instalação
Execute `validate.bat` para verificar se tudo está instalado corretamente.

### Setup Automatizado
Para configuração automática, execute `install-all.bat` seguido de `dev-all.bat`.

---

## 🚀 INÍCIO RÁPIDO (RECOMENDADO)

### ⚡ Sistema Automatizado - Novo!

Execute estes comandos para rodar todo o projeto automaticamente:

```batch
# 1. Instalar todas as dependências (primeira vez)
install-all.bat

# 2. Iniciar todos os serviços simultaneamente
start-all.bat

# 3. Parar todos os serviços quando terminar
stop-all.bat
```

**✅ Resultado**: 3 terminais abertos automaticamente:
- 🔧 **Backend** → http://localhost:3000
- 🤖 **API Python** → http://localhost:5000  
- 📱 **Frontend** → Expo Metro (escaneie QR Code)

### 🔧 Como Funciona o Novo Sistema:

1. **`install-all.bat`**:
   - Instala dependências do backend separadamente
   - Instala dependências do frontend separadamente  
   - Cria ambiente virtual Python isolado
   - **Mantém encapsulamento de cada projeto**

2. **`dev-all.bat`**:
   - Abre 3 terminais independentes
   - Cada um executa em seu diretório próprio
   - Sem conflitos de dependências

3. **`stop-all.bat`**:
   - Para todos os processos Node.js e Python
   - Libera todas as portas (3000, 5000, 8081)

### 💡 Vantagens:
✅ **Encapsulamento preservado**  
✅ **Dependências isoladas**  
✅ **Um comando para tudo**  
✅ **Fácil de debugar**  
✅ **Compatível com boas práticas**

---

## 📦 INSTALAÇÃO MANUAL (AVANÇADO)

### 1. Clone o Projeto
```bash
git clone <URL-DO-REPOSITORIO>
cd InfraAlert
```

### 2. Configure o Backend
```bash
cd backend

# Instalar dependências
npm install

# Configurar banco de dados
npx prisma generate
npx prisma migrate dev

# Iniciar servidor
npm run dev
```
**✅ Backend rodando em: http://localhost:3000**

### 3. Configure o Frontend
```bash
cd ../frontend

# Instalar dependências
npm install

# Configurar IP no config.js (IMPORTANTE!)
# Edite frontend/config.js e coloque seu IP local
export const API_URL = 'http://SEU-IP-AQUI:3000';

# Iniciar app
npm start
```
**✅ Frontend rodando - Escaneie o QR Code**

### 4. (Opcional) API Python para IA
```bash
cd ../backend/rota-segura-api

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Iniciar API
python src/main.py
```
**✅ API Python rodando em: http://localhost:5000**

---

## ⚙️ CONFIGURAÇÕES IMPORTANTES

### 🔧 Backend (.env)
O arquivo `backend/.env` já está configurado com:
- ✅ Banco PostgreSQL (Neon)
- ✅ JWT Secret gerado
- ✅ Credenciais de admin
- ✅ Configurações básicas

### 📱 Frontend (config.js)
**CRUCIAL**: Configure seu IP local em `frontend/config.js`:

```javascript
// Descobrir seu IP:
// Windows: abra cmd e digite: ipconfig
// Mac/Linux: ifconfig ou hostname -I

export const API_URL = 'http://192.168.1.100:3000'; // Exemplo
```

**⚠️ SEM ESSA CONFIGURAÇÃO O APP NÃO CONECTARÁ AO BACKEND!**

---

---

## 🎯 EXECUÇÃO INDIVIDUAL (AVANÇADO)

### Desenvolvimento Básico (2 Terminais)
```bash
# Terminal 1 - Backend
cd backend
npm run dev
# ✅ API rodando em http://localhost:3000

# Terminal 2 - Frontend
cd frontend  
npm start
# ✅ Escaneie o QR Code com Expo Go
```

### Desenvolvimento Completo (3 Terminais)
```bash
# Terminal 1 - Backend Node.js
cd backend && npm run dev

# Terminal 2 - API Python (IA)
cd backend/rota-segura-api
call venv\Scripts\activate    # Windows
python src/main.py

# Terminal 3 - Frontend
cd frontend && npm start
```

---

## 🛠️ COMANDOS ÚTEIS

### Novo Sistema (Recomendado)
```batch
install-all.bat      # Instalar todas as dependências
dev-all.bat          # Iniciar todos os serviços
stop-all.bat         # Parar todos os serviços
validate.bat         # Verificar ambiente
```

### Backend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npx prisma studio    # Visualizar banco
npx prisma migrate reset  # Resetar banco
```

### Frontend
```bash
npm start            # Iniciar desenvolvimento
npm run android      # Emulador Android
npm run ios          # Emulador iOS
npm run web          # Versão web
```

### Python API
```bash
python src/main.py   # Iniciar servidor
pip freeze > requirements.txt  # Atualizar deps
```

## 🚨 SOLUÇÃO DE PROBLEMAS

### ❌ "Cannot connect to backend"
```bash
# 1. Verificar se backend está rodando
curl http://localhost:3000/health

# 2. Descobrir seu IP local
ipconfig

# 3. Atualizar config.js
export const API_URL = 'http://SEU-IP:3000';
```

### ❌ Problemas com dependências
```bash
# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Backend  
cd backend
rm -rf node_modules package-lock.json
npm install
```

### ❌ Banco de dados não conecta
```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev
npx prisma generate
```

### ❌ Porta já em uso
```bash
# Windows - matar processo na porta 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou mudar porta no .env
PORT=3001
```

---