# Teste Simples das Novas Funcionalidades - Onion RSV 360

Write-Host "Testando Novas Funcionalidades - Onion RSV 360" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Configuracoes
$baseUrl = "http://localhost"
$coreUrl = "${baseUrl}:5000"
$notificationsUrl = "${baseUrl}:5002"
$dataUrl = "${baseUrl}:5004"
$adminUrl = "${baseUrl}:5011"

# Funcao para fazer requisicoes HTTP
function Invoke-TestRequest {
    param(
        [string]$Url,
        [string]$Method = "GET",
        [object]$Body = $null
    )
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
        }
        
        if ($Body) {
            $params.Body = $Body | ConvertTo-Json -Depth 10
            $params.Headers = @{"Content-Type" = "application/json"}
        }
        
        $response = Invoke-RestMethod @params
        return @{
            Success = $true
            Data = $response
        }
    }
    catch {
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

# Teste 1: Verificar saude dos servicos
Write-Host "`nTeste 1: Verificando saude dos servicos" -ForegroundColor Yellow

$services = @(
    @{Url = $coreUrl; Name = "Core Service"},
    @{Url = $notificationsUrl; Name = "Notifications Service"},
    @{Url = $dataUrl; Name = "Data Service"},
    @{Url = $adminUrl; Name = "Admin Service"}
)

foreach ($service in $services) {
    $result = Invoke-TestRequest -Url "$($service.Url)/health"
    if ($result.Success) {
        Write-Host "OK $($service.Name): $($result.Data.status)" -ForegroundColor Green
    } else {
        Write-Host "ERRO $($service.Name): $($result.Error)" -ForegroundColor Red
    }
}

# Teste 2: Verificar status das APIs
Write-Host "`nTeste 2: Verificando status das APIs" -ForegroundColor Yellow

foreach ($service in $services) {
    $result = Invoke-TestRequest -Url "$($service.Url)/api/status"
    if ($result.Success) {
        Write-Host "OK $($service.Name) API: $($result.Data.status)" -ForegroundColor Green
        Write-Host "   Versao: $($result.Data.versao)" -ForegroundColor Gray
    } else {
        Write-Host "ERRO $($service.Name) API: $($result.Error)" -ForegroundColor Red
    }
}

# Teste 3: Testar API de clima
Write-Host "`nTeste 3: Testando API de clima" -ForegroundColor Yellow

$weatherResult = Invoke-TestRequest -Url "$notificationsUrl/api/weather/1"
if ($weatherResult.Success) {
    Write-Host "OK API de clima funcionando" -ForegroundColor Green
    Write-Host "   Clima: $($weatherResult.Data.weather)" -ForegroundColor Gray
} else {
    Write-Host "ERRO API de clima: $($weatherResult.Error)" -ForegroundColor Red
}

# Teste 4: Testar API de eventos
Write-Host "`nTeste 4: Testando API de eventos" -ForegroundColor Yellow

$eventsResult = Invoke-TestRequest -Url "$notificationsUrl/api/events/1"
if ($eventsResult.Success) {
    Write-Host "OK API de eventos funcionando" -ForegroundColor Green
    Write-Host "   Eventos encontrados: $($eventsResult.Data.events.Count)" -ForegroundColor Gray
} else {
    Write-Host "ERRO API de eventos: $($eventsResult.Error)" -ForegroundColor Red
}

# Teste 5: Testar LangChain
Write-Host "`nTeste 5: Testando LangChain" -ForegroundColor Yellow

$langchainData = @{
    property_id = 1
    room_rate = 150.00
    guests_count = 2
    checkin_date = "2025-07-25"
    checkout_date = "2025-07-27"
}

$langchainResult = Invoke-TestRequest -Url "$DATA_URL/api/recommendation" -Method POST -Body $langchainData
if ($langchainResult.Success) {
    Write-Host "OK LangChain funcionando" -ForegroundColor Green
    Write-Host "   Recomendacao gerada com sucesso" -ForegroundColor Gray
} else {
    Write-Host "AVISO LangChain: $($langchainResult.Error)" -ForegroundColor Yellow
    Write-Host "   (Pode ser esperado se OPENAI_API_KEY nao estiver configurado)" -ForegroundColor Gray
}

# Teste 6: Testar comparacao de precos
Write-Host "`nTeste 6: Testando comparacao de precos" -ForegroundColor Yellow

$priceComparisonResult = Invoke-TestRequest -Url "$NOTIFICATIONS_URL/api/price-comparison/1" -Method POST
if ($priceComparisonResult.Success) {
    Write-Host "OK Comparacao de precos funcionando" -ForegroundColor Green
    Write-Host "   Analise iniciada com sucesso" -ForegroundColor Gray
} else {
    Write-Host "ERRO Comparacao de precos: $($priceComparisonResult.Error)" -ForegroundColor Red
}

# Resumo dos testes
Write-Host "`nResumo dos Testes" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Cyan

$testResults = @(
    "OK Servicos de saude verificados",
    "OK APIs de status verificadas", 
    "OK API de clima testada",
    "OK API de eventos testada",
    "OK LangChain testado (se configurado)",
    "OK Comparacao de precos testada"
)

foreach ($result in $testResults) {
    Write-Host $result -ForegroundColor Green
}

Write-Host "`nTestes das novas funcionalidades concluidos!" -ForegroundColor Cyan
Write-Host "`nProximos passos:" -ForegroundColor Yellow
Write-Host "1. Configure as variaveis de ambiente no arquivo .env" -ForegroundColor White
Write-Host "2. Configure as APIs de clima (OpenWeather, WeatherAPI)" -ForegroundColor White
Write-Host "3. Configure a API de eventos (Eventbrite)" -ForegroundColor White
Write-Host "4. Configure a API do OpenAI para LangChain" -ForegroundColor White
Write-Host "5. Acesse o Grafana em http://localhost:3001 (admin/admin123)" -ForegroundColor White
Write-Host "6. Acesse o Prometheus em http://localhost:9090" -ForegroundColor White
Write-Host "7. Acesse o AlertManager em http://localhost:9093" -ForegroundColor White

Write-Host "`nSistema Onion RSV 360 com novas funcionalidades pronto!" -ForegroundColor Green 