# Script para instalar dependências do Onion RSV 360
# Autor: Sistema Onion RSV
# Data: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

Write-Host "🔧 Instalando Dependências - Onion RSV 360" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Verificar se Python está instalado
try {
    $pythonVersion = python --version
    Write-Host "✅ Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python não encontrado. Instale Python 3.8+ primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se pip está instalado
try {
    $pipVersion = pip --version
    Write-Host "✅ pip encontrado: $pipVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ pip não encontrado. Instale pip primeiro." -ForegroundColor Red
    exit 1
}

# Criar ambiente virtual se não existir
$venvPath = "backend/venv"
if (-not (Test-Path $venvPath)) {
    Write-Host "`n🐍 Criando ambiente virtual..." -ForegroundColor Yellow
    python -m venv $venvPath
    Write-Host "✅ Ambiente virtual criado em $venvPath" -ForegroundColor Green
} else {
    Write-Host "✅ Ambiente virtual já existe em $venvPath" -ForegroundColor Green
}

# Ativar ambiente virtual
Write-Host "`n🔧 Ativando ambiente virtual..." -ForegroundColor Yellow
& "$venvPath/Scripts/Activate.ps1"

# Atualizar pip
Write-Host "`n📦 Atualizando pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip

# Instalar dependências dos serviços
$services = @(
    "backend/core",
    "backend/chatbot", 
    "backend/payments",
    "backend/notifications",
    "backend/analytics",
    "backend/admin",
    "backend/reports",
    "backend/shared"
)

foreach ($service in $services) {
    if (Test-Path "$service/requirements.txt") {
        Write-Host "`n📦 Instalando dependências de $service..." -ForegroundColor Yellow
        try {
            pip install -r "$service/requirements.txt"
            Write-Host "✅ Dependências de $service instaladas com sucesso" -ForegroundColor Green
        } catch {
            Write-Host "❌ Erro ao instalar dependências de $service: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "⚠️ requirements.txt não encontrado em $service" -ForegroundColor Yellow
    }
}

# Instalar dependências globais
Write-Host "`n🌐 Instalando dependências globais..." -ForegroundColor Yellow
$globalDeps = @(
    "fastapi==0.109.0",
    "uvicorn==0.25.0", 
    "sqlalchemy==2.0.25",
    "psycopg2-binary==2.9.9",
    "redis==5.0.1",
    "prometheus-client==0.19.0",
    "python-multipart==0.0.6",
    "pydantic==2.5.3",
    "requests==2.32.0",
    "python-dotenv==1.0.0"
)

foreach ($dep in $globalDeps) {
    try {
        pip install $dep
        Write-Host "✅ $dep instalado" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erro ao instalar $dep: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Instalação de dependências concluída!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host "Para ativar o ambiente virtual manualmente:" -ForegroundColor Cyan
Write-Host "  & `"${venvPath}/Scripts/Activate.ps1`"" -ForegroundColor Gray
Write-Host "`nPara executar os testes:" -ForegroundColor Cyan
Write-Host "  .\scripts\test-v2.2.0.ps1" -ForegroundColor Gray 