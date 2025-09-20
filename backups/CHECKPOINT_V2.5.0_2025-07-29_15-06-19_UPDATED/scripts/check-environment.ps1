# Script para verificar ambiente do Onion RSV 360
# Autor: Sistema Onion RSV

Write-Host "🔍 Verificando Ambiente - Onion RSV 360" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Verificar Python
Write-Host "`n🐍 Verificando Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version
    Write-Host "✅ Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python não encontrado. Instale Python 3.8+ primeiro." -ForegroundColor Red
    exit 1
}

# Verificar pip
Write-Host "`n📦 Verificando pip..." -ForegroundColor Yellow
try {
    $pipVersion = pip --version
    Write-Host "✅ pip encontrado: $pipVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ pip não encontrado. Instale pip primeiro." -ForegroundColor Red
    exit 1
}

# Verificar Node.js
Write-Host "`n🟢 Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado. Instale Node.js 16+ primeiro." -ForegroundColor Red
    exit 1
}

# Verificar npm
Write-Host "`n📦 Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm encontrado: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm não encontrado. Instale npm primeiro." -ForegroundColor Red
    exit 1
}

# Verificar Docker
Write-Host "`n🐳 Verificando Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker encontrado: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Docker não encontrado. Algumas funcionalidades podem não funcionar." -ForegroundColor Yellow
}

# Verificar Docker Compose
Write-Host "`n🐳 Verificando Docker Compose..." -ForegroundColor Yellow
try {
    $dockerComposeVersion = docker-compose --version
    Write-Host "✅ Docker Compose encontrado: $dockerComposeVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Docker Compose não encontrado. Algumas funcionalidades podem não funcionar." -ForegroundColor Yellow
}

# Verificar ambiente virtual Python
Write-Host "`n🐍 Verificando ambiente virtual Python..." -ForegroundColor Yellow
$venvPath = "backend/venv"
if (Test-Path $venvPath) {
    Write-Host "✅ Ambiente virtual encontrado em $venvPath" -ForegroundColor Green
} else {
    Write-Host "⚠️ Ambiente virtual não encontrado. Execute o script install-dependencies.ps1" -ForegroundColor Yellow
}

# Verificar arquivos de configuração
Write-Host "`n📁 Verificando arquivos de configuração..." -ForegroundColor Yellow
$configFiles = @(
    "docker-compose.yml",
    "docker-compose.dev.yml",
    "frontend/package.json",
    "backend/core/requirements.txt",
    "backend/chatbot/requirements.txt",
    "backend/payments/requirements.txt"
)

foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file encontrado" -ForegroundColor Green
    } else {
        Write-Host "❌ $file não encontrado" -ForegroundColor Red
    }
}

# Verificar variáveis de ambiente
Write-Host "`n🔧 Verificando variáveis de ambiente..." -ForegroundColor Yellow
$envFile = ".env"
if (Test-Path $envFile) {
    Write-Host "✅ Arquivo .env encontrado" -ForegroundColor Green
} else {
    Write-Host "⚠️ Arquivo .env não encontrado. Copie env.example para .env" -ForegroundColor Yellow
}

# Verificar portas em uso
Write-Host "`n🔌 Verificando portas em uso..." -ForegroundColor Yellow
$ports = @(3000, 5000, 5002, 5004, 5005, 5006, 5007, 5008, 5009, 5010, 5011, 9090, 9093)
foreach ($port in $ports) {
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($connection) {
            Write-Host "⚠️ Porta $port está em uso" -ForegroundColor Yellow
        } else {
            Write-Host "✅ Porta $port está livre" -ForegroundColor Green
        }
    } catch {
        Write-Host "✅ Porta $port está livre" -ForegroundColor Green
    }
}

Write-Host "`n🎉 Verificação de ambiente concluída!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

Write-Host "`n📝 Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Se houver problemas, execute: .\scripts\install-dependencies.ps1" -ForegroundColor White
Write-Host "2. Configure o arquivo .env com suas variáveis de ambiente" -ForegroundColor White
Write-Host "3. Execute: .\scripts\start-dev.ps1 para iniciar o sistema" -ForegroundColor White
Write-Host "4. Execute: .\scripts\test-v2.2.0.ps1 para testar o sistema" -ForegroundColor White 