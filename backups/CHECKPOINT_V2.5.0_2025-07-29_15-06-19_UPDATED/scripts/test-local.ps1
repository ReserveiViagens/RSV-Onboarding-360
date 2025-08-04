# 🧪 Script de Teste Automatizado - Onion 360 RSV (Windows)
# Este script testa todos os microserviços do sistema no Windows

param(
    [switch]$Verbose
)

# Configurações
$BaseUrl = "http://localhost"
$Timeout = 30
$MaxRetries = 3

# Lista de serviços para testar
$Services = @(
    @{Port = "5000"; Name = "Core Service"},
    @{Port = "5002"; Name = "Notifications Service"},
    @{Port = "5003"; Name = "Travel Service"},
    @{Port = "5004"; Name = "Data Service"},
    @{Port = "5005"; Name = "Finance Service"},
    @{Port = "5006"; Name = "Tickets Service"},
    @{Port = "5007"; Name = "E-commerce Service"},
    @{Port = "5008"; Name = "Parks Service"},
    @{Port = "5009"; Name = "Attractions Service"},
    @{Port = "5012"; Name = "Inventory Service"},
    @{Port = "5013"; Name = "Sales Service"},
    @{Port = "5014"; Name = "Marketing Service"},
    @{Port = "8007"; Name = "Analytics Service"},
    @{Port = "8008"; Name = "SEO Service"},
    @{Port = "8009"; Name = "Multilingual Service"},
    @{Port = "8010"; Name = "Subscriptions Service"},
    @{Port = "8011"; Name = "Gift Cards Service"},
    @{Port = "8012"; Name = "Coupons Service"},
    @{Port = "8013"; Name = "Rewards Service"},
    @{Port = "8014"; Name = "Loyalty Service"},
    @{Port = "8015"; Name = "Groups Service"},
    @{Port = "8016"; Name = "Documents Service"},
    @{Port = "8017"; Name = "Visa Service"},
    @{Port = "8018"; Name = "Insurance Service"},
    @{Port = "8019"; Name = "Refunds Service"},
    @{Port = "8020"; Name = "Sectoral Finance Service"},
    @{Port = "8021"; Name = "Admin Service"},
    @{Port = "8022"; Name = "Maps Service"},
    @{Port = "8023"; Name = "Videos Service"},
    @{Port = "8024"; Name = "Photos Service"},
    @{Port = "8025"; Name = "Reviews Service"},
    @{Port = "8026"; Name = "Chatbots Service"}
)

# Função para log colorido
function Write-Log {
    param([string]$Message, [string]$Color = "Green")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor $Color
}

function Write-Warning {
    param([string]$Message)
    Write-Log "WARNING: $Message" "Yellow"
}

function Write-Error {
    param([string]$Message)
    Write-Log "ERROR: $Message" "Red"
}

function Write-Info {
    param([string]$Message)
    Write-Log "INFO: $Message" "Blue"
}

# Função para testar um serviço
function Test-Service {
    param(
        [string]$Port,
        [string]$Name
    )
    
    $url = "$BaseUrl`:$Port/health"
    Write-Log "Testando $Name ($url)"
    
    for ($i = 1; $i -le $MaxRetries; $i++) {
        try {
            $response = Invoke-WebRequest -Uri $url -TimeoutSec $Timeout -UseBasicParsing -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Log "✅ $Name está funcionando" "Green"
                return $true
            }
        }
        catch {
            if ($i -eq $MaxRetries) {
                Write-Error "❌ $Name não está respondendo após $MaxRetries tentativas"
                return $false
            }
            else {
                Write-Warning "Tentativa $i/$MaxRetries falhou para $Name, tentando novamente..."
                Start-Sleep -Seconds 2
            }
        }
    }
}

# Função para testar banco de dados
function Test-Database {
    Write-Log "Testando conexão com PostgreSQL..."
    
    try {
        $result = docker-compose -f docker-compose.local.yml exec -T postgres psql -U user -d rsv -c "SELECT 1;" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Log "✅ PostgreSQL está funcionando" "Green"
            return $true
        }
        else {
            Write-Error "❌ PostgreSQL não está respondendo"
            return $false
        }
    }
    catch {
        Write-Error "❌ Erro ao conectar com PostgreSQL"
        return $false
    }
}

# Função para testar Redis
function Test-Redis {
    Write-Log "Testando conexão com Redis..."
    
    try {
        $result = docker-compose -f docker-compose.local.yml exec -T redis redis-cli ping 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Log "✅ Redis está funcionando" "Green"
            return $true
        }
        else {
            Write-Error "❌ Redis não está respondendo"
            return $false
        }
    }
    catch {
        Write-Error "❌ Erro ao conectar com Redis"
        return $false
    }
}

# Função para testar frontend
function Test-Frontend {
    Write-Log "Testando Frontend..."
    
    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl`:3000" -TimeoutSec $Timeout -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Log "✅ Frontend está funcionando" "Green"
            return $true
        }
    }
    catch {
        Write-Error "❌ Frontend não está respondendo"
        return $false
    }
}

# Função para testar monitoramento
function Test-Monitoring {
    Write-Log "Testando serviços de monitoramento..."
    
    # Testar Prometheus
    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl`:9090/api/v1/targets" -TimeoutSec $Timeout -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Log "✅ Prometheus está funcionando" "Green"
        }
        else {
            Write-Warning "⚠️ Prometheus não está respondendo"
        }
    }
    catch {
        Write-Warning "⚠️ Prometheus não está respondendo"
    }
    
    # Testar Grafana
    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl`:3001" -TimeoutSec $Timeout -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Log "✅ Grafana está funcionando" "Green"
        }
        else {
            Write-Warning "⚠️ Grafana não está respondendo"
        }
    }
    catch {
        Write-Warning "⚠️ Grafana não está respondendo"
    }
}

# Função para testar APIs específicas
function Test-SpecificAPIs {
    Write-Log "Testando APIs específicas..."
    
    # Testar criação de tier de fidelidade
    try {
        $body = @{
            name = "Test Tier"
            description = "Tier para teste"
            min_points = 0
            max_points = 1000
            discount_percentage = 5.0
        } | ConvertTo-Json
        
        $response = Invoke-WebRequest -Uri "$BaseUrl`:8014/tiers/" -Method POST -Body $body -ContentType "application/json" -TimeoutSec $Timeout -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Log "✅ API de Loyalty Service está funcionando" "Green"
        }
        else {
            Write-Warning "⚠️ API de Loyalty Service não está respondendo"
        }
    }
    catch {
        Write-Warning "⚠️ API de Loyalty Service não está respondendo"
    }
    
    # Testar criação de grupo
    try {
        $body = @{
            name = "Test Group"
            description = "Grupo para teste"
            group_type = "social"
            created_by = 1
        } | ConvertTo-Json
        
        $response = Invoke-WebRequest -Uri "$BaseUrl`:8015/groups/" -Method POST -Body $body -ContentType "application/json" -TimeoutSec $Timeout -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Log "✅ API de Groups Service está funcionando" "Green"
        }
        else {
            Write-Warning "⚠️ API de Groups Service não está respondendo"
        }
    }
    catch {
        Write-Warning "⚠️ API de Groups Service não está respondendo"
    }
    
    # Testar criação de chatbot
    try {
        $body = @{
            name = "Test Bot"
            description = "Bot para teste"
            chatbot_type = "support"
            welcome_message = "Olá!"
        } | ConvertTo-Json
        
        $response = Invoke-WebRequest -Uri "$BaseUrl`:8026/chatbots/" -Method POST -Body $body -ContentType "application/json" -TimeoutSec $Timeout -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Log "✅ API de Chatbots Service está funcionando" "Green"
        }
        else {
            Write-Warning "⚠️ API de Chatbots Service não está respondendo"
        }
    }
    catch {
        Write-Warning "⚠️ API de Chatbots Service não está respondendo"
    }
}

# Função para verificar recursos do sistema
function Check-SystemResources {
    Write-Log "Verificando recursos do sistema..."
    
    try {
        # Verificar containers rodando
        $containers = docker ps --format "{{.Names}}" | Measure-Object -Line
        Write-Log "Containers rodando: $($containers.Lines)"
        
        # Verificar uso de recursos (simplificado)
        Write-Log "Para ver uso detalhado de recursos, execute: docker stats"
    }
    catch {
        Write-Warning "Não foi possível verificar recursos do sistema"
    }
}

# Função principal
function Main {
    Write-Log "🚀 Iniciando testes do sistema Onion 360 RSV" "Green"
    Write-Log "==========================================" "Green"
    
    # Verificar se Docker está rodando
    try {
        $null = docker info 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Docker não está rodando. Inicie o Docker primeiro."
            exit 1
        }
    }
    catch {
        Write-Error "Docker não está rodando. Inicie o Docker primeiro."
        exit 1
    }
    
    # Verificar se os serviços estão rodando
    try {
        $services = docker-compose -f docker-compose.local.yml ps 2>$null
        if ($services -notmatch "Up") {
            Write-Error "Serviços não estão rodando. Execute 'docker-compose -f docker-compose.local.yml up -d' primeiro."
            exit 1
        }
    }
    catch {
        Write-Error "Erro ao verificar serviços. Execute 'docker-compose -f docker-compose.local.yml up -d' primeiro."
        exit 1
    }
    
    Write-Info "Aguardando inicialização dos serviços..."
    Start-Sleep -Seconds 10
    
    # Contadores
    $totalServices = $Services.Count
    $passedServices = 0
    $failedServices = 0
    
    # Testar cada serviço
    foreach ($service in $Services) {
        if (Test-Service -Port $service.Port -Name $service.Name) {
            $passedServices++
        }
        else {
            $failedServices++
        }
    }
    
    # Testar infraestrutura
    Write-Log "==========================================" "Green"
    Write-Log "Testando infraestrutura..." "Green"
    
    Test-Database
    Test-Redis
    Test-Frontend
    Test-Monitoring
    
    # Testar APIs específicas
    Write-Log "==========================================" "Green"
    Test-SpecificAPIs
    
    # Verificar recursos
    Write-Log "==========================================" "Green"
    Check-SystemResources
    
    # Resumo final
    Write-Log "==========================================" "Green"
    Write-Log "📊 RESUMO DOS TESTES" "Green"
    Write-Log "==========================================" "Green"
    Write-Log "Total de serviços testados: $totalServices" "Green"
    Write-Log "✅ Serviços funcionando: $passedServices" "Green"
    Write-Log "❌ Serviços com problemas: $failedServices" "Green"
    
    if ($failedServices -eq 0) {
        Write-Log "🎉 TODOS OS SERVIÇOS ESTÃO FUNCIONANDO PERFEITAMENTE!" "Green"
        Write-Log "🌐 Acesse o sistema em: http://localhost:3000" "Green"
        Write-Log "📊 Monitoramento: http://localhost:3001 (admin/admin)" "Green"
        Write-Log "📈 Métricas: http://localhost:9090" "Green"
    }
    else {
        Write-Warning "⚠️ Alguns serviços apresentaram problemas. Verifique os logs acima."
        Write-Log "Para ver logs detalhados: docker-compose -f docker-compose.local.yml logs" "Green"
    }
    
    Write-Log "==========================================" "Green"
    Write-Log "✅ Teste concluído!" "Green"
}

# Executar função principal
Main 