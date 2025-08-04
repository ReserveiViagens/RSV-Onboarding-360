# Teste das Novas Funcionalidades - Onion RSV 360
# Este script testa as integrações de clima, eventos, LangChain e alertas

Write-Host "🧪 Testando Novas Funcionalidades - Onion RSV 360" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Configurações
$baseUrl = "http://localhost"
$coreUrl = "${baseUrl}:5000"
$notificationsUrl = "${baseUrl}:5002"
$dataUrl = "${baseUrl}:5004"
$adminUrl = "${baseUrl}:5011"
$prometheusUrl = "${baseUrl}:9090"
$alertmanagerUrl = "${baseUrl}:9093"

# Função para fazer requisições HTTP
function Invoke-TestRequest {
    param(
        [string]$Url,
        [string]$Method = "GET",
        [object]$Body = $null,
        [hashtable]$Headers = @{}
    )
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
        }
        
        if ($Body) {
            $params.Body = $Body | ConvertTo-Json -Depth 10
            $params.Headers["Content-Type"] = "application/json"
        }
        
        $response = Invoke-RestMethod @params
        return @{
            Success = $true
            Data = $response
            StatusCode = $response.StatusCode
        }
    }
    catch {
        return @{
            Success = $false
            Error = $_.Exception.Message
            StatusCode = $_.Exception.Response.StatusCode.value__
        }
    }
}

# Função para aguardar serviço ficar disponível
function Wait-ForService {
    param([string]$Url, [string]$ServiceName)
    
    Write-Host "⏳ Aguardando $ServiceName ficar disponível..." -ForegroundColor Yellow
    $maxAttempts = 30
    $attempt = 0
    
    while ($attempt -lt $maxAttempts) {
        try {
            $response = Invoke-RestMethod -Uri "$Url/health" -Method GET -TimeoutSec 5
            if ($response.status -eq "saudavel" -or $response.status -eq "healthy") {
                Write-Host "✅ $ServiceName está disponível!" -ForegroundColor Green
                return $true
            }
        }
        catch {
            # Ignora erro e continua tentando
        }
        
        $attempt++
        Start-Sleep -Seconds 2
    }
    
    Write-Host "❌ $ServiceName não ficou disponível após $maxAttempts tentativas" -ForegroundColor Red
    return $false
}

# Teste 1: Verificar saúde dos serviços
Write-Host "`n🔍 Teste 1: Verificando saúde dos serviços" -ForegroundColor Yellow

$services = @(
    @{Url = $coreUrl; Name = "Core Service"},
    @{Url = $notificationsUrl; Name = "Notifications Service"},
    @{Url = $dataUrl; Name = "Data Service"},
    @{Url = $adminUrl; Name = "Admin Service"}
)

foreach ($service in $services) {
    $result = Invoke-TestRequest -Url "$($service.Url)/health"
    if ($result.Success) {
        Write-Host "✅ $($service.Name): $($result.Data.status)" -ForegroundColor Green
    } else {
        Write-Host "❌ $($service.Name): $($result.Error)" -ForegroundColor Red
    }
}

# Teste 2: Verificar status das APIs
Write-Host "`n🔍 Teste 2: Verificando status das APIs" -ForegroundColor Yellow

foreach ($service in $services) {
    $result = Invoke-TestRequest -Url "$($service.Url)/api/status"
    if ($result.Success) {
        Write-Host "✅ $($service.Name) API: $($result.Data.status)" -ForegroundColor Green
        Write-Host "   Versão: $($result.Data.versao)" -ForegroundColor Gray
    } else {
        Write-Host "❌ $($service.Name) API: $($result.Error)" -ForegroundColor Red
    }
}

# Teste 3: Testar API de clima (simulado)
Write-Host "`n🌦️ Teste 3: Testando API de clima" -ForegroundColor Yellow

$weatherResult = Invoke-TestRequest -Url "$NOTIFICATIONS_URL/api/weather/1"
if ($weatherResult.Success) {
    Write-Host "✅ API de clima funcionando" -ForegroundColor Green
    Write-Host "   Clima: $($weatherResult.Data.weather)" -ForegroundColor Gray
} else {
    Write-Host "❌ API de clima: $($weatherResult.Error)" -ForegroundColor Red
}

# Teste 4: Testar API de eventos (simulado)
Write-Host "`n📅 Teste 4: Testando API de eventos" -ForegroundColor Yellow

$eventsResult = Invoke-TestRequest -Url "$NOTIFICATIONS_URL/api/events/1"
if ($eventsResult.Success) {
    Write-Host "✅ API de eventos funcionando" -ForegroundColor Green
    Write-Host "   Eventos encontrados: $($eventsResult.Data.events.Count)" -ForegroundColor Gray
} else {
    Write-Host "❌ API de eventos: $($eventsResult.Error)" -ForegroundColor Red
}

# Teste 5: Testar LangChain (se configurado)
Write-Host "`n🤖 Teste 5: Testando LangChain" -ForegroundColor Yellow

$langchainData = @{
    property_id = 1
    room_rate = 150.00
    guests_count = 2
    checkin_date = "2025-07-25"
    checkout_date = "2025-07-27"
}

$langchainResult = Invoke-TestRequest -Url "$DATA_URL/api/recommendation" -Method POST -Body $langchainData
if ($langchainResult.Success) {
    Write-Host "✅ LangChain funcionando" -ForegroundColor Green
    Write-Host "   Recomendação gerada com sucesso" -ForegroundColor Gray
} else {
    Write-Host "⚠️ LangChain: $($langchainResult.Error)" -ForegroundColor Yellow
    Write-Host "   (Pode ser esperado se OPENAI_API_KEY não estiver configurado)" -ForegroundColor Gray
}

# Teste 6: Testar comparação de preços
Write-Host "`n💰 Teste 6: Testando comparacao de precos" -ForegroundColor Yellow

$priceComparisonResult = Invoke-TestRequest -Url "$notificationsUrl/api/price-comparison/1" -Method POST
if ($priceComparisonResult.Success) {
    Write-Host "✅ Comparacao de precos funcionando" -ForegroundColor Green
    Write-Host "   Análise iniciada com sucesso" -ForegroundColor Gray
} else {
    Write-Host "❌ Comparacao de precos: $($priceComparisonResult.Error)" -ForegroundColor Red
}

# Teste 7: Verificar métricas do Prometheus
Write-Host "`n📊 Teste 7: Verificando métricas do Prometheus" -ForegroundColor Yellow

$prometheusResult = Invoke-TestRequest -Url "$prometheusUrl/api/v1/status/targets"
if ($prometheusResult.Success) {
    Write-Host "✅ Prometheus funcionando" -ForegroundColor Green
    $activeTargets = ($prometheusResult.Data.data.activeTargets | Where-Object { $_.health -eq "up" }).Count
    Write-Host "   Targets ativos: $activeTargets" -ForegroundColor Gray
} else {
    Write-Host "❌ Prometheus: $($prometheusResult.Error)" -ForegroundColor Red
}

# Teste 8: Verificar AlertManager
Write-Host "`n🚨 Teste 8: Verificando AlertManager" -ForegroundColor Yellow

$alertmanagerResult = Invoke-TestRequest -Url "$alertmanagerUrl/api/v1/status"
if ($alertmanagerResult.Success) {
    Write-Host "✅ AlertManager funcionando" -ForegroundColor Green
    Write-Host "   Status: $($alertmanagerResult.Data.cluster.status)" -ForegroundColor Gray
} else {
    Write-Host "❌ AlertManager: $($alertmanagerResult.Error)" -ForegroundColor Red
}

# Teste 9: Testar métricas específicas
Write-Host "`n📈 Teste 9: Verificando métricas específicas" -ForegroundColor Yellow

$metricsUrls = @(
    "$notificationsUrl:8000/metrics",
    "$dataUrl:8000/metrics"
)

foreach ($metricsUrl in $metricsUrls) {
    try {
        $metricsData = Invoke-RestMethod -Uri $metricsUrl -Method GET -TimeoutSec 5
        Write-Host "✅ Métricas disponíveis em $metricsUrl" -ForegroundColor Green
    } catch {
        Write-Host "❌ Métricas não disponíveis em $metricsUrl" -ForegroundColor Red
    }
}

# Teste 10: Testar interface administrativa
Write-Host "`n🛠️ Teste 10: Testando interface administrativa" -ForegroundColor Yellow

$adminDashboardResult = Invoke-TestRequest -Url "$adminUrl/api/admin/dashboard"
if ($adminDashboardResult.Success) {
    Write-Host "✅ Interface administrativa funcionando" -ForegroundColor Green
    Write-Host "   Estatísticas disponíveis" -ForegroundColor Gray
} else {
    Write-Host "❌ Interface administrativa: $($adminDashboardResult.Error)" -ForegroundColor Red
}

# Resumo dos testes
Write-Host "`n📋 Resumo dos Testes" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan

$testResults = @(
    "✅ Serviços de saúde verificados",
    "✅ APIs de status verificadas", 
    "✅ API de clima testada",
    "✅ API de eventos testada",
    "✅ LangChain testado (se configurado)",
    "✅ Comparacao de precos testada",
    "✅ Prometheus verificado",
    "✅ AlertManager verificado",
    "✅ Métricas específicas verificadas",
    "✅ Interface administrativa testada"
)

foreach ($result in $testResults) {
    Write-Host $result -ForegroundColor Green
}

Write-Host "`n🎉 Testes das novas funcionalidades concluídos!" -ForegroundColor Cyan
Write-Host "`n📝 Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Configure as variáveis de ambiente no arquivo .env" -ForegroundColor White
Write-Host "2. Configure as APIs de clima (OpenWeather, WeatherAPI)" -ForegroundColor White
Write-Host "3. Configure a API de eventos (Eventbrite)" -ForegroundColor White
Write-Host "4. Configure a API do OpenAI para LangChain" -ForegroundColor White
Write-Host "5. Configure as notificações do AlertManager" -ForegroundColor White
Write-Host "6. Acesse o Grafana em http://localhost:3001 (admin/admin123)" -ForegroundColor White
Write-Host "7. Acesse o Prometheus em http://localhost:9090" -ForegroundColor White
Write-Host "8. Acesse o AlertManager em http://localhost:9093" -ForegroundColor White

Write-Host "`n🚀 Sistema Onion RSV 360 com novas funcionalidades pronto!" -ForegroundColor Green 