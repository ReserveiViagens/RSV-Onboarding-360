# Script de inicialização para desenvolvimento - Onion RSV 360
# Versão 2.0.0 - PowerShell

param(
    [switch]$SkipFrontend,
    [switch]$SkipBackend,
    [switch]$Force
)

# Configurações
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Cores para output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$White = "White"

# Função para log colorido
function Write-LogInfo {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Blue
}

function Write-LogSuccess {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Green
}

function Write-LogWarning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-LogError {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

Write-Host "Iniciando Onion RSV 360 - Ambiente de Desenvolvimento" -ForegroundColor $White
Write-Host "==================================================" -ForegroundColor $White

# Verificar se Docker está rodando
function Test-Docker {
    Write-LogInfo "Verificando Docker..."
    try {
        docker info | Out-Null
        Write-LogSuccess "Docker está rodando"
        return $true
    }
    catch {
        Write-LogError "Docker não está rodando. Por favor, inicie o Docker Desktop e tente novamente."
        return $false
    }
}

# Verificar se Docker Compose está disponível
function Test-DockerCompose {
    Write-LogInfo "Verificando Docker Compose..."
    try {
        docker-compose --version | Out-Null
        Write-LogSuccess "Docker Compose está disponível"
        return $true
    }
    catch {
        Write-LogError "Docker Compose não está disponível. Por favor, instale o Docker Compose."
        return $false
    }
}

# Verificar se Node.js está instalado
function Test-NodeJS {
    Write-LogInfo "Verificando Node.js..."
    try {
        $nodeVersion = node --version
        Write-LogSuccess "Node.js está disponível ($nodeVersion)"
        return $true
    }
    catch {
        Write-LogWarning "Node.js não está instalado. O frontend não será iniciado automaticamente."
        return $false
    }
}

# Verificar se Python está instalado
function Test-Python {
    Write-LogInfo "Verificando Python..."
    try {
        $pythonVersion = python --version
        Write-LogSuccess "Python está disponível ($pythonVersion)"
        return $true
    }
    catch {
        Write-LogError "Python não está instalado. Por favor, instale o Python 3."
        return $false
    }
}

# Configurar variáveis de ambiente
function Set-Environment {
    Write-LogInfo "Configurando variáveis de ambiente..."
    
    if (-not (Test-Path ".env")) {
        Write-LogWarning "Arquivo .env não encontrado. Criando a partir do env.example..."
        if (Test-Path "env.example") {
            Copy-Item "env.example" ".env"
            Write-LogSuccess "Arquivo .env criado"
        }
        else {
            Write-LogError "Arquivo env.example não encontrado"
            return $false
        }
    }
    else {
        Write-LogSuccess "Arquivo .env já existe"
    }
    return $true
}

# Configurar diretório de logs
function Set-LogsDirectory {
    Write-LogInfo "Configurando diretório de logs..."
    if (-not (Test-Path "logs")) {
        New-Item -ItemType Directory -Path "logs" | Out-Null
        Write-LogSuccess "Diretório de logs criado"
    }
    else {
        Write-LogSuccess "Diretório de logs já existe"
    }
}

# Configurar frontend
function Set-Frontend {
    if ($SkipFrontend) {
        Write-LogWarning "Configuração do frontend pulada"
        return $true
    }
    
    Write-LogInfo "Configurando frontend..."
    Push-Location "frontend"
    
    if (-not (Test-Path "node_modules")) {
        Write-LogInfo "Instalando dependências do frontend..."
        npm install
        Write-LogSuccess "Dependências do frontend instaladas"
    }
    else {
        Write-LogSuccess "Dependências do frontend já instaladas"
    }
    
    Pop-Location
    return $true
}

# Configurar backend
function Set-Backend {
    if ($SkipBackend) {
        Write-LogWarning "Configuração do backend pulada"
        return $true
    }
    
    Write-LogInfo "Configurando backend..."
    Push-Location "backend"
    
    if (-not (Test-Path "venv")) {
        Write-LogInfo "Criando ambiente virtual Python..."
        python -m venv venv
        Write-LogSuccess "Ambiente virtual criado"
    }
    
    Write-LogInfo "Ativando ambiente virtual..."
    & "venv\Scripts\Activate.ps1"
    
    Write-LogInfo "Instalando dependências do backend..."
    pip install -r requirements.txt
    Write-LogSuccess "Dependências do backend instaladas"
    
    Pop-Location
    return $true
}

# Iniciar serviços Docker
function Start-DockerServices {
    Write-LogInfo "Iniciando serviços com Docker Compose..."
    
    # Parar serviços existentes
    try {
        docker-compose down 2>$null
    }
    catch {
        # Ignorar erro se não houver serviços rodando
    }
    
    # Construir e iniciar serviços
    docker-compose up --build -d
    Write-LogSuccess "Serviços iniciados com Docker Compose"
}

# Aguardar serviços ficarem prontos
function Wait-ServicesReady {
    Write-LogInfo "Aguardando serviços ficarem prontos..."
    
    # Aguardar PostgreSQL
    Write-LogInfo "Aguardando PostgreSQL..."
    $timeout = 30
    while ($timeout -gt 0) {
        try {
            docker-compose exec -T postgres pg_isready -U user 2>$null | Out-Null
            if ($LASTEXITCODE -eq 0) {
                Write-LogSuccess "PostgreSQL está pronto"
                break
            }
        }
        catch {
            # Ignorar erro
        }
        Start-Sleep -Seconds 1
        $timeout--
    }
    
    if ($timeout -le 0) {
        Write-LogError "Timeout aguardando PostgreSQL"
        return $false
    }
    
    # Aguardar Redis
    Write-LogInfo "Aguardando Redis..."
    $timeout = 30
    while ($timeout -gt 0) {
        try {
            docker-compose exec -T redis redis-cli ping 2>$null | Out-Null
            if ($LASTEXITCODE -eq 0) {
                Write-LogSuccess "Redis está pronto"
                break
            }
        }
        catch {
            # Ignorar erro
        }
        Start-Sleep -Seconds 1
        $timeout--
    }
    
    if ($timeout -le 0) {
        Write-LogError "Timeout aguardando Redis"
        return $false
    }
    
    return $true
}

# Executar migrações
function Invoke-Migrations {
    Write-LogInfo "Executando migrações do banco de dados..."
    
    Push-Location "backend"
    
    if (Test-Path "alembic.ini") {
        & "venv\Scripts\Activate.ps1"
        alembic upgrade head
        Write-LogSuccess "Migrações executadas"
    }
    else {
        Write-LogWarning "Alembic não configurado. Pulando migrações."
    }
    
    Pop-Location
}

# Iniciar frontend em desenvolvimento
function Start-FrontendDev {
    if ($SkipFrontend) {
        Write-LogWarning "Frontend não iniciado - pulado"
        return
    }
    
    if (Test-NodeJS) {
        Write-LogInfo "Iniciando frontend em modo desenvolvimento..."
        Push-Location "frontend"
        
        # Iniciar em background
        Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Hidden -RedirectStandardOutput "..\logs\frontend.log" -RedirectStandardError "..\logs\frontend.log"
        
        # Aguardar um pouco para o processo iniciar
        Start-Sleep -Seconds 3
        
        # Tentar obter o PID
        $frontendProcess = Get-Process | Where-Object { $_.ProcessName -eq "node" -and $_.CommandLine -like "*next*" } | Select-Object -First 1
        if ($frontendProcess) {
            $frontendProcess.Id | Out-File -FilePath "..\logs\frontend.pid" -Encoding UTF8
            Write-LogSuccess "Frontend iniciado (PID: $($frontendProcess.Id))"
        }
        else {
            Write-LogWarning "Não foi possível obter o PID do frontend"
        }
        
        Pop-Location
    }
    else {
        Write-LogWarning "Frontend não iniciado - Node.js não disponível"
    }
}

# Mostrar status dos serviços
function Show-Status {
    Write-Host ""
    Write-Host "==================================================" -ForegroundColor $White
    Write-Host "Onion RSV 360 - Status dos Serviços" -ForegroundColor $White
    Write-Host "==================================================" -ForegroundColor $White
    
    # Status do Docker Compose
    try {
        $dockerStatus = docker-compose ps
        if ($dockerStatus -match "Up") {
            Write-LogSuccess "Serviços Docker: Ativos"
            Write-Host $dockerStatus
        }
        else {
            Write-LogError "Serviços Docker: Inativos"
        }
    }
    catch {
        Write-LogError "Erro ao verificar status dos serviços Docker"
    }
    
    # Status do frontend
    if (Test-Path "logs\frontend.pid") {
        $frontendPid = Get-Content "logs\frontend.pid"
        $frontendProcess = Get-Process -Id $frontendPid -ErrorAction SilentlyContinue
        if ($frontendProcess) {
            Write-LogSuccess "Frontend: Ativo (PID: $frontendPid)"
        }
        else {
            Write-LogError "Frontend: Inativo"
        }
    }
    else {
        Write-LogWarning "Frontend: Não iniciado"
    }
    
    Write-Host ""
    Write-Host "URLs de Acesso:" -ForegroundColor $White
    Write-Host "  Frontend: http://localhost:3000" -ForegroundColor $White
    Write-Host "  Backend API: http://localhost:5000" -ForegroundColor $White
    Write-Host "  Serviço Core: http://localhost:5000" -ForegroundColor $White
    Write-Host "  Adminer (DB): http://localhost:8080" -ForegroundColor $White
    Write-Host ""
    Write-Host "Logs:" -ForegroundColor $White
    Write-Host "  Frontend: logs\frontend.log" -ForegroundColor $White
    Write-Host "  Docker: docker-compose logs -f" -ForegroundColor $White
    Write-Host ""
    Write-Host "Para parar: .\scripts\stop-dev.ps1" -ForegroundColor $White
}

# Função principal
function Main {
    Write-Host "Iniciando verificação de pré-requisitos..." -ForegroundColor $White
    
    if (-not (Test-Docker)) { exit 1 }
    if (-not (Test-DockerCompose)) { exit 1 }
    if (-not (Test-Python)) { exit 1 }
    
    Write-Host ""
    Write-Host "Configurando ambiente..." -ForegroundColor $White
    
    if (-not (Set-Environment)) { exit 1 }
    Set-LogsDirectory
    if (-not (Set-Frontend)) { exit 1 }
    if (-not (Set-Backend)) { exit 1 }
    
    Write-Host ""
    Write-Host "Iniciando serviços..." -ForegroundColor $White
    
    Start-DockerServices
    if (-not (Wait-ServicesReady)) { exit 1 }
    Invoke-Migrations
    Start-FrontendDev
    
    Show-Status
}

# Executar função principal
try {
    Main
}
catch {
    Write-LogError "Erro: $($_.Exception.Message)"
    exit 1
} 