# ============================================
# Thumdra CRM - Script de Inicialização Completa
# ============================================
# Este script automatiza o setup e inicialização do projeto Thumdra
# Plataforma: Windows PowerShell

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Thumdra CRM - Iniciando Projeto Completo" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Função para exibir mensagens de erro
function Write-Error-Message {
    param([string]$Message)
    Write-Host "[ERRO] $Message" -ForegroundColor Red
}

# Função para exibir mensagens de sucesso
function Write-Success-Message {
    param([string]$Message)
    Write-Host "[OK] $Message" -ForegroundColor Green
}

# Função para exibir mensagens de aviso
function Write-Warning-Message {
    param([string]$Message)
    Write-Host "[AVISO] $Message" -ForegroundColor Yellow
}

# Função para exibir mensagens de info
function Write-Info-Message {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

# ============================================
# 1. Verificar se Docker está instalado
# ============================================
Write-Info-Message "Verificando se Docker está instalado..."

$dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue
if (-not $dockerInstalled) {
    Write-Error-Message "Docker não está instalado!"
    Write-Host "Por favor, instale o Docker Desktop: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

Write-Success-Message "Docker está instalado"

# ============================================
# 2. Verificar se Docker está rodando
# ============================================
Write-Info-Message "Verificando se Docker está rodando..."

$dockerRunning = docker ps 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Warning-Message "Docker não está rodando. Tentando iniciar..."
    Write-Host "Iniciando Docker Desktop (isso pode levar alguns segundos)..." -ForegroundColor Yellow

    # Tentar iniciar Docker Desktop
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe" -ErrorAction SilentlyContinue

    # Aguardar até Docker estar pronto (timeout de 60 segundos)
    $timeout = 60
    $elapsed = 0
    while ($elapsed -lt $timeout) {
        Start-Sleep -Seconds 2
        $elapsed += 2
        $dockerRunning = docker ps 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success-Message "Docker iniciado com sucesso!"
            break
        }
    }

    if ($LASTEXITCODE -ne 0) {
        Write-Error-Message "Não foi possível iniciar o Docker automaticamente."
        Write-Host "Por favor, inicie o Docker Desktop manualmente e execute este script novamente." -ForegroundColor Yellow
        exit 1
    }
}

Write-Success-Message "Docker está rodando"

# ============================================
# 3. Iniciar containers Docker (PostgreSQL + Redis)
# ============================================
Write-Info-Message "Verificando containers Docker..."

docker-compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Error-Message "Falha ao iniciar containers Docker"
    exit 1
}

Write-Success-Message "Containers Docker iniciados"

# ============================================
# 4. Aguardar containers ficarem healthy
# ============================================
Write-Info-Message "Aguardando containers ficarem prontos (timeout: 30s)..."

$timeout = 30
$elapsed = 0
$postgresReady = $false
$redisReady = $false

while ($elapsed -lt $timeout) {
    Start-Sleep -Seconds 2
    $elapsed += 2

    # Verificar PostgreSQL
    $postgresStatus = docker exec zyva-postgres pg_isready -U zyva 2>&1
    if ($LASTEXITCODE -eq 0) {
        $postgresReady = $true
    }

    # Verificar Redis
    $redisStatus = docker exec zyva-redis redis-cli ping 2>&1
    if ($redisStatus -match "PONG") {
        $redisReady = $true
    }

    if ($postgresReady -and $redisReady) {
        Write-Success-Message "Containers prontos!"
        break
    }
}

if (-not $postgresReady -or -not $redisReady) {
    Write-Warning-Message "Containers podem não estar completamente prontos. Continuando mesmo assim..."
}

# ============================================
# 5. Verificar/Instalar dependências na raiz
# ============================================
Write-Info-Message "Verificando dependências na raiz..."

if (-not (Test-Path ".\node_modules")) {
    Write-Info-Message "Instalando dependências na raiz (concurrently)..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Message "Falha ao instalar dependências na raiz"
        exit 1
    }
    Write-Success-Message "Dependências da raiz instaladas"
} else {
    Write-Success-Message "Dependências da raiz já instaladas"
}

# ============================================
# 6. Verificar/Instalar dependências do Backend
# ============================================
Write-Info-Message "Verificando dependências do backend..."

if (-not (Test-Path ".\backend\node_modules")) {
    Write-Info-Message "Instalando dependências do backend..."
    Set-Location backend
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Message "Falha ao instalar dependências do backend"
        Set-Location ..
        exit 1
    }
    Set-Location ..
    Write-Success-Message "Dependências do backend instaladas"
} else {
    Write-Success-Message "Dependências do backend já instaladas"
}

# ============================================
# 7. Verificar/Instalar dependências do Frontend
# ============================================
Write-Info-Message "Verificando dependências do frontend..."

if (-not (Test-Path ".\frontend\node_modules")) {
    Write-Info-Message "Instalando dependências do frontend..."
    Set-Location frontend
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Message "Falha ao instalar dependências do frontend"
        Set-Location ..
        exit 1
    }
    Set-Location ..
    Write-Success-Message "Dependências do frontend instaladas"
} else {
    Write-Success-Message "Dependências do frontend já instaladas"
}

# ============================================
# 8. Verificar arquivos .env
# ============================================
Write-Info-Message "Verificando arquivos .env..."

$envMissing = $false

if (-not (Test-Path ".\backend\.env")) {
    Write-Warning-Message "Arquivo backend/.env não encontrado!"
    Write-Host "  Crie o arquivo com as seguintes variáveis:" -ForegroundColor Yellow
    Write-Host "  DATABASE_URL=`"postgresql://zyva:zyva123@localhost:5432/zyva_db`"" -ForegroundColor Yellow
    Write-Host "  REDIS_URL=`"redis://localhost:6379`"" -ForegroundColor Yellow
    Write-Host "  JWT_SECRET=`"your-secret-key`"" -ForegroundColor Yellow
    Write-Host "  PORT=3001" -ForegroundColor Yellow
    Write-Host "  NODE_ENV=development" -ForegroundColor Yellow
    Write-Host ""
    $envMissing = $true
}

if (-not (Test-Path ".\frontend\.env.local")) {
    Write-Warning-Message "Arquivo frontend/.env.local não encontrado!"
    Write-Host "  Crie o arquivo com a seguinte variável:" -ForegroundColor Yellow
    Write-Host "  NEXT_PUBLIC_API_URL=http://localhost:3001" -ForegroundColor Yellow
    Write-Host ""
    $envMissing = $true
}

if (-not $envMissing) {
    Write-Success-Message "Arquivos .env encontrados"
}

# ============================================
# 9. Gerar Prisma Client
# ============================================
Write-Info-Message "Gerando Prisma Client..."

Set-Location backend
npm run prisma:generate 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Warning-Message "Falha ao gerar Prisma Client (pode não ser crítico)"
} else {
    Write-Success-Message "Prisma Client gerado"
}
Set-Location ..

# ============================================
# 10. Aplicar migrations do Prisma
# ============================================
Write-Info-Message "Aplicando migrations do Prisma..."

Set-Location backend
npm run prisma:migrate 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Warning-Message "Falha ao aplicar migrations (pode não ser crítico)"
} else {
    Write-Success-Message "Migrations aplicadas"
}
Set-Location ..

# ============================================
# 11. Iniciar servidores (Backend + Frontend)
# ============================================
Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Iniciando Servidores" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Info-Message "Backend:  http://localhost:3001"
Write-Info-Message "Frontend: http://localhost:3000"
Write-Host ""
Write-Host "Pressione Ctrl+C para parar todos os servidores" -ForegroundColor Yellow
Write-Host ""

# Executar npm run dev na raiz (usa concurrently)
npm run dev
