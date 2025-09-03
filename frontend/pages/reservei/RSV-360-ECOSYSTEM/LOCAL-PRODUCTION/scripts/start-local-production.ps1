# 🚀 SCRIPT DE INICIALIZAÇÃO AUTOMATIZADA - POWERSHELL
# RSV 360° ECOSYSTEM - Ambiente de Produção Local

param(
    [switch]$SkipBuild,
    [switch]$SkipHealthCheck,
    [switch]$Verbose
)

# 🎨 Configurações de cores
$ErrorActionPreference = "Stop"

# 📋 Função para log colorido
function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "INFO"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = switch ($Level) {
        "ERROR" { "Red" }
        "WARNING" { "Yellow" }
        "SUCCESS" { "Green" }
        "INFO" { "Blue" }
        default { "White" }
    }
    
    Write-Host "[$timestamp] $Message" -ForegroundColor $color
}

function Write-Error {
    param([string]$Message)
    Write-Log $Message "ERROR"
}

function Write-Warning {
    param([string]$Message)
    Write-Log $Message "WARNING"
}

function Write-Success {
    param([string]$Message)
    Write-Log $Message "SUCCESS"
}

function Write-Info {
    param([string]$Message)
    Write-Log $Message "INFO"
}

# 🏗️ Banner de inicialização
Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║           🏭 RSV 360° ECOSYSTEM - PRODUÇÃO LOCAL            ║
║                                                              ║
║              Inicialização Automatizada Completa             ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Magenta

# 📁 Verificar se estamos no diretório correto
if (-not (Test-Path "docker-compose.local.yml")) {
    Write-Error "Arquivo docker-compose.local.yml não encontrado!"
    Write-Error "Execute este script no diretório LOCAL-PRODUCTION/"
    exit 1
}

# 🔍 Verificar dependências
Write-Info "🔍 Verificando dependências..."

# Verificar Docker
try {
    $dockerVersion = docker --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker não está instalado ou não está no PATH"
    }
    Write-Success "✅ Docker encontrado: $dockerVersion"
} catch {
    Write-Error "Docker não está instalado ou não está no PATH"
    exit 1
}

# Verificar Docker Compose
try {
    $composeVersion = docker-compose --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker Compose não está instalado ou não está no PATH"
    }
    Write-Success "✅ Docker Compose encontrado: $composeVersion"
} catch {
    Write-Error "Docker Compose não está instalado ou não está no PATH"
    exit 1
}

# Verificar se Docker está rodando
try {
    docker info 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker não está rodando"
    }
    Write-Success "✅ Docker está rodando"
} catch {
    Write-Error "Docker não está rodando. Inicie o Docker Desktop primeiro."
    exit 1
}

# 🧹 Limpeza prévia
Write-Info "🧹 Limpando containers e volumes antigos..."
try {
    docker-compose -f docker-compose.local.yml down --volumes --remove-orphans 2>$null
    docker system prune -f 2>$null
    Write-Success "✅ Limpeza concluída"
} catch {
    Write-Warning "⚠️ Erro durante a limpeza (continuando...)"
}

# 📦 Construir imagens
if (-not $SkipBuild) {
    Write-Info "📦 Construindo imagens Docker..."
    try {
        docker-compose -f docker-compose.local.yml build --no-cache
        Write-Success "✅ Imagens construídas com sucesso"
    } catch {
        Write-Error "❌ Erro ao construir imagens"
        exit 1
    }
} else {
    Write-Info "⏭️ Pulando construção de imagens (--SkipBuild)"
}

# 🗄️ Inicializar banco de dados
Write-Info "🗄️ Inicializando banco de dados..."
try {
    docker-compose -f docker-compose.local.yml up -d db-local redis-local
    Write-Success "✅ Banco de dados iniciado"
} catch {
    Write-Error "❌ Erro ao iniciar banco de dados"
    exit 1
}

# ⏳ Aguardar banco estar pronto
Write-Info "⏳ Aguardando banco de dados estar pronto..."
Start-Sleep -Seconds 10

# 🔍 Verificar saúde do banco
Write-Info "🔍 Verificando saúde do banco de dados..."
$dbReady = $false
for ($i = 1; $i -le 30; $i++) {
    try {
        $result = docker-compose -f docker-compose.local.yml exec -T db-local pg_isready -U rsvuser -d rsv_ecosystem_local 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "✅ Banco de dados está pronto"
            $dbReady = $true
            break
        }
    } catch {
        # Continuar tentando
    }
    
    if ($i -eq 30) {
        Write-Error "❌ Banco de dados não ficou pronto em 30 tentativas"
        exit 1
    }
    Start-Sleep -Seconds 2
}

# 🚀 Iniciar todos os serviços
Write-Info "🚀 Iniciando todos os serviços..."
try {
    docker-compose -f docker-compose.local.yml up -d
    Write-Success "✅ Serviços iniciados"
} catch {
    Write-Error "❌ Erro ao iniciar serviços"
    exit 1
}

# ⏳ Aguardar serviços iniciarem
Write-Info "⏳ Aguardando serviços iniciarem..."
Start-Sleep -Seconds 15

# 🔍 Verificar saúde dos serviços
if (-not $SkipHealthCheck) {
    Write-Info "🔍 Verificando saúde dos serviços..."
    
    $services = @(
        @{Name="Ecosystem Master"; Port=3000; Path="/health"},
        @{Name="CRM System"; Port=3001; Path="/health"},
        @{Name="Booking Engine"; Port=3002; Path="/health"},
        @{Name="Hotel Management"; Port=3003; Path="/health"},
        @{Name="Analytics Intelligence"; Port=3004; Path="/health"},
        @{Name="Grafana Dashboard"; Port=3005; Path=""},
        @{Name="Prometheus"; Port=9090; Path=""}
    )
    
    $allHealthy = $true
    
    foreach ($service in $services) {
        Write-Info "🔍 Verificando $($service.Name) na porta $($service.Port)..."
        
        $healthy = $false
        for ($i = 1; $i -le 10; $i++) {
            try {
                $url = "http://localhost:$($service.Port)$($service.Path)"
                $response = Invoke-WebRequest -Uri $url -TimeoutSec 5 -UseBasicParsing 2>$null
                if ($response.StatusCode -eq 200) {
                    Write-Success "✅ $($service.Name) está respondendo na porta $($service.Port)"
                    $healthy = $true
                    break
                }
            } catch {
                # Continuar tentando
            }
            
            if ($i -eq 10) {
                Write-Warning "⚠️ $($service.Name) não está respondendo na porta $($service.Port)"
                $allHealthy = $false
            }
            
            Start-Sleep -Seconds 3
        }
    }
} else {
    Write-Info "⏭️ Pulando verificação de saúde (--SkipHealthCheck)"
    $allHealthy = $true
}

# 📊 Mostrar status dos containers
Write-Info "📊 Status dos containers:"
docker-compose -f docker-compose.local.yml ps

# 🌐 Mostrar URLs de acesso
Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║                    🌐 URLs DE ACESSO                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  🏠 Ecosystem Master:    http://localhost:3000              ║
║  👥 CRM System:          http://localhost:3001              ║
║  🎯 Booking Engine:      http://localhost:3002              ║
║  🏨 Hotel Management:    http://localhost:3003              ║
║  📊 Analytics:           http://localhost:3004              ║
║  📈 Grafana Dashboard:   http://localhost:3005              ║
║  🔍 Prometheus:          http://localhost:9090              ║
║                                                              ║
║  🗄️  Database:           localhost:5432                     ║
║  🔴 Redis:               localhost:6379                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# 📋 Credenciais de acesso
Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║                    🔐 CREDENCIAIS                           ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  🗄️  Database:                                              ║
║     Host: localhost                                          ║
║     Port: 5432                                               ║
║     Database: rsv_ecosystem_local                            ║
║     User: rsvuser                                            ║
║     Password: rsvpassword                                    ║
║                                                              ║
║  📈 Grafana:                                                 ║
║     User: admin                                              ║
║     Password: rsvadmin2025                                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Yellow

# 🧪 Executar testes básicos
Write-Info "🧪 Executando testes básicos de conectividade..."

# Teste de conectividade com banco
try {
    $dbTest = docker-compose -f docker-compose.local.yml exec -T db-local psql -U rsvuser -d rsv_ecosystem_local -c "SELECT 1;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "✅ Conectividade com banco de dados OK"
    } else {
        Write-Warning "⚠️ Problema na conectividade com banco de dados"
    }
} catch {
    Write-Warning "⚠️ Problema na conectividade com banco de dados"
}

# Teste de conectividade com Redis
try {
    $redisTest = docker-compose -f docker-compose.local.yml exec -T redis-local redis-cli ping 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "✅ Conectividade com Redis OK"
    } else {
        Write-Warning "⚠️ Problema na conectividade com Redis"
    }
} catch {
    Write-Warning "⚠️ Problema na conectividade com Redis"
}

# 📝 Logs de inicialização
Write-Info "📝 Logs de inicialização salvos em: ./logs/"

# 🎉 Finalização
if ($allHealthy) {
    Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║           🎉 INICIALIZAÇÃO CONCLUÍDA COM SUCESSO!           ║
║                                                              ║
║        Todos os serviços estão rodando corretamente         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Green
    
    Write-Success "🚀 Ambiente de produção local está pronto para uso!"
    Write-Info "📊 Para monitorar os logs: docker-compose -f docker-compose.local.yml logs -f"
    Write-Info "🛑 Para parar os serviços: docker-compose -f docker-compose.local.yml down"
    
} else {
    Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║           ⚠️ INICIALIZAÇÃO CONCLUÍDA COM AVISOS            ║
║                                                              ║
║        Alguns serviços podem não estar funcionando          ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Yellow
    
    Write-Warning "⚠️ Verifique os logs dos serviços com problemas"
    Write-Info "📊 Para ver logs: docker-compose -f docker-compose.local.yml logs [service-name]"
}

# 🔄 Comandos úteis
Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║                    🔧 COMANDOS ÚTEIS                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  📊 Ver logs:                                                ║
║     docker-compose -f docker-compose.local.yml logs -f      ║
║                                                              ║
║  🔄 Reiniciar serviço:                                       ║
║     docker-compose -f docker-compose.local.yml restart [service] ║
║                                                              ║
║  🛑 Parar tudo:                                              ║
║     docker-compose -f docker-compose.local.yml down          ║
║                                                              ║
║  🧹 Limpeza completa:                                        ║
║     docker-compose -f docker-compose.local.yml down -v       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Blue

Write-Success "🎉 Script de inicialização concluído!"
exit 0
