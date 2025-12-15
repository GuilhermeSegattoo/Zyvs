#!/bin/bash

# ============================================
# Zyva CRM - Script de Inicialização Completa
# ============================================
# Este script automatiza o setup e inicialização do projeto Zyva
# Plataforma: Linux, macOS, WSL, Git Bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}=================================================="
echo -e "  Zyva CRM - Iniciando Projeto Completo"
echo -e "==================================================${NC}"
echo ""

# Funções para mensagens
error_message() {
    echo -e "${RED}[ERRO] $1${NC}"
}

success_message() {
    echo -e "${GREEN}[OK] $1${NC}"
}

warning_message() {
    echo -e "${YELLOW}[AVISO] $1${NC}"
}

info_message() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# ============================================
# 1. Verificar se Docker está instalado
# ============================================
info_message "Verificando se Docker está instalado..."

if ! command -v docker &> /dev/null; then
    error_message "Docker não está instalado!"
    echo -e "${YELLOW}Por favor, instale o Docker: https://docs.docker.com/get-docker/${NC}"
    exit 1
fi

success_message "Docker está instalado"

# ============================================
# 2. Verificar se Docker está rodando
# ============================================
info_message "Verificando se Docker está rodando..."

if ! docker ps &> /dev/null; then
    error_message "Docker não está rodando!"
    echo -e "${YELLOW}Por favor, inicie o Docker e execute este script novamente.${NC}"
    echo ""

    # Tentar detectar o sistema operacional e sugerir comando
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo -e "${YELLOW}macOS: Abra o Docker Desktop${NC}"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo -e "${YELLOW}Linux: Execute 'sudo systemctl start docker'${NC}"
    fi

    exit 1
fi

success_message "Docker está rodando"

# ============================================
# 3. Iniciar containers Docker (PostgreSQL + Redis)
# ============================================
info_message "Verificando containers Docker..."

docker-compose up -d
if [ $? -ne 0 ]; then
    error_message "Falha ao iniciar containers Docker"
    exit 1
fi

success_message "Containers Docker iniciados"

# ============================================
# 4. Aguardar containers ficarem healthy
# ============================================
info_message "Aguardando containers ficarem prontos (timeout: 30s)..."

TIMEOUT=30
ELAPSED=0
POSTGRES_READY=false
REDIS_READY=false

while [ $ELAPSED -lt $TIMEOUT ]; do
    sleep 2
    ELAPSED=$((ELAPSED + 2))

    # Verificar PostgreSQL
    if docker exec zyva-postgres pg_isready -U zyva &> /dev/null; then
        POSTGRES_READY=true
    fi

    # Verificar Redis
    if docker exec zyva-redis redis-cli ping 2>&1 | grep -q "PONG"; then
        REDIS_READY=true
    fi

    if [ "$POSTGRES_READY" = true ] && [ "$REDIS_READY" = true ]; then
        success_message "Containers prontos!"
        break
    fi
done

if [ "$POSTGRES_READY" != true ] || [ "$REDIS_READY" != true ]; then
    warning_message "Containers podem não estar completamente prontos. Continuando mesmo assim..."
fi

# ============================================
# 5. Verificar/Instalar dependências na raiz
# ============================================
info_message "Verificando dependências na raiz..."

if [ ! -d "./node_modules" ]; then
    info_message "Instalando dependências na raiz (concurrently)..."
    npm install
    if [ $? -ne 0 ]; then
        error_message "Falha ao instalar dependências na raiz"
        exit 1
    fi
    success_message "Dependências da raiz instaladas"
else
    success_message "Dependências da raiz já instaladas"
fi

# ============================================
# 6. Verificar/Instalar dependências do Backend
# ============================================
info_message "Verificando dependências do backend..."

if [ ! -d "./backend/node_modules" ]; then
    info_message "Instalando dependências do backend..."
    cd backend
    npm install
    if [ $? -ne 0 ]; then
        error_message "Falha ao instalar dependências do backend"
        cd ..
        exit 1
    fi
    cd ..
    success_message "Dependências do backend instaladas"
else
    success_message "Dependências do backend já instaladas"
fi

# ============================================
# 7. Verificar/Instalar dependências do Frontend
# ============================================
info_message "Verificando dependências do frontend..."

if [ ! -d "./frontend/node_modules" ]; then
    info_message "Instalando dependências do frontend..."
    cd frontend
    npm install
    if [ $? -ne 0 ]; then
        error_message "Falha ao instalar dependências do frontend"
        cd ..
        exit 1
    fi
    cd ..
    success_message "Dependências do frontend instaladas"
else
    success_message "Dependências do frontend já instaladas"
fi

# ============================================
# 8. Verificar arquivos .env
# ============================================
info_message "Verificando arquivos .env..."

ENV_MISSING=false

if [ ! -f "./backend/.env" ]; then
    warning_message "Arquivo backend/.env não encontrado!"
    echo -e "${YELLOW}  Crie o arquivo com as seguintes variáveis:${NC}"
    echo -e "${YELLOW}  DATABASE_URL=\"postgresql://zyva:zyva123@localhost:5432/zyva_db\"${NC}"
    echo -e "${YELLOW}  REDIS_URL=\"redis://localhost:6379\"${NC}"
    echo -e "${YELLOW}  JWT_SECRET=\"your-secret-key\"${NC}"
    echo -e "${YELLOW}  PORT=3001${NC}"
    echo -e "${YELLOW}  NODE_ENV=development${NC}"
    echo ""
    ENV_MISSING=true
fi

if [ ! -f "./frontend/.env.local" ]; then
    warning_message "Arquivo frontend/.env.local não encontrado!"
    echo -e "${YELLOW}  Crie o arquivo com a seguinte variável:${NC}"
    echo -e "${YELLOW}  NEXT_PUBLIC_API_URL=http://localhost:3001${NC}"
    echo ""
    ENV_MISSING=true
fi

if [ "$ENV_MISSING" = false ]; then
    success_message "Arquivos .env encontrados"
fi

# ============================================
# 9. Gerar Prisma Client
# ============================================
info_message "Gerando Prisma Client..."

cd backend
npm run prisma:generate &> /dev/null
if [ $? -ne 0 ]; then
    warning_message "Falha ao gerar Prisma Client (pode não ser crítico)"
else
    success_message "Prisma Client gerado"
fi
cd ..

# ============================================
# 10. Aplicar migrations do Prisma
# ============================================
info_message "Aplicando migrations do Prisma..."

cd backend
npm run prisma:migrate &> /dev/null
if [ $? -ne 0 ]; then
    warning_message "Falha ao aplicar migrations (pode não ser crítico)"
else
    success_message "Migrations aplicadas"
fi
cd ..

# ============================================
# 11. Iniciar servidores (Backend + Frontend)
# ============================================
echo ""
echo -e "${CYAN}=================================================="
echo -e "  Iniciando Servidores"
echo -e "==================================================${NC}"
echo ""
info_message "Backend:  http://localhost:3001"
info_message "Frontend: http://localhost:3000"
echo ""
echo -e "${YELLOW}Pressione Ctrl+C para parar todos os servidores${NC}"
echo ""

# Executar npm run dev na raiz (usa concurrently)
npm run dev
