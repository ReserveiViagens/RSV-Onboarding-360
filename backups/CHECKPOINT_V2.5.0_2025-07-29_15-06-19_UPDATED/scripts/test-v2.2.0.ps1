# Script de Teste Completo - Onion RSV 360 v2.2.0
# Autor: Sistema Onion RSV

Write-Host "🚀 Teste Completo - Onion RSV 360 v2.2.0" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Configurações
$baseUrl = "http://localhost"
$services = @{
    "Core API" = "5000"
    "Travel API" = "5001"
    "Attractions API" = "5002"
    "Tickets API" = "5004"
    "Analytics API" = "5006"
    "SEO API" = "5007"
    "Rewards API" = "5009"
    "Sales API" = "5013"
    "Videos API" = "5016"
    "Core Service" = "5017"
    "Chatbots API" = "5018"
}

# Função para testar health check
function Test-ServiceHealth {
    param($serviceName, $port)
    try {
        $healthResponse = Invoke-RestMethod -Uri "${baseUrl}:${port}/health" -Method GET -TimeoutSec 10
        Write-Host "  ✅ ${serviceName}: OK" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "  ❌ ${serviceName}: FALHOU - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Função para testar rate limiting
function Test-RateLimiting {
    Write-Host "`n🛡️ Testando Rate Limiting..." -ForegroundColor Yellow
    
    try {
        # Fazer múltiplas requisições para testar rate limiting
        for ($i = 1; $i -le 5; $i++) {
            $rateResponse = Invoke-RestMethod -Uri "${baseUrl}:5000/api/test/rate-limit" -Method GET -TimeoutSec 5
            Start-Sleep -Milliseconds 200
        }
        Write-Host "  ✅ Rate Limiting: OK" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "  ❌ Rate Limiting: FALHOU - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Função para testar cache
function Test-Cache {
    Write-Host "`n💾 Testando Cache..." -ForegroundColor Yellow
    
    try {
        $cacheData = @{
            key = "test_key"
            value = "test_value"
            ttl = 300
        }
        
        $cacheSetResponse = Invoke-RestMethod -Uri "${baseUrl}:5000/api/cache/set" -Method POST -Body ($cacheData | ConvertTo-Json) -ContentType "application/json" -TimeoutSec 10
        Write-Host "  ✅ Cache Set: OK" -ForegroundColor Green
        
        $cacheGetResponse = Invoke-RestMethod -Uri "${baseUrl}:5000/api/cache/get/test_key" -Method GET -TimeoutSec 10
        Write-Host "  ✅ Cache Get: OK" -ForegroundColor Green
        
        return $true
    }
    catch {
        Write-Host "  ❌ Cache: FALHOU - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Função para testar ML predictions
function Test-MLPredictions {
    Write-Host "`n🤖 Testando ML Predictions..." -ForegroundColor Yellow
    
    try {
        $mlData = @{
            user_id = 1
            booking_history = @("hotel", "flight", "car")
            preferences = @("luxury", "adventure")
            budget = 5000
        }
        
        $mlResponse = Invoke-RestMethod -Uri "${baseUrl}:5000/api/ml/predict" -Method POST -Body ($mlData | ConvertTo-Json) -ContentType "application/json" -TimeoutSec 15
        Write-Host "  ✅ ML Predictions: OK" -ForegroundColor Green
        Write-Host "  🎯 Recomendações: $($mlResponse.recommendations.Count)" -ForegroundColor Cyan
        
        return $true
    }
    catch {
        Write-Host "  ❌ ML Predictions: FALHOU - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Função para testar chatbot
function Test-Chatbot {
    Write-Host "`n💬 Testando Chatbot..." -ForegroundColor Yellow
    
    try {
        $chatData = @{
            message = "Olá, preciso de ajuda com uma reserva"
            user_id = 1
            session_id = "test_session_123"
        }
        
        $chatResponse = Invoke-RestMethod -Uri "${baseUrl}:5018/api/chatbot/chat" -Method POST -Body ($chatData | ConvertTo-Json) -ContentType "application/json" -TimeoutSec 15
        Write-Host "  ✅ Chatbot: OK" -ForegroundColor Green
        Write-Host "  💬 Resposta: $($chatResponse.response)" -ForegroundColor Cyan
        
        return $true
    }
    catch {
        Write-Host "  ❌ Chatbot: FALHOU - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Função para testar pagamentos
function Test-Payments {
    Write-Host "`n💳 Testando Pagamentos..." -ForegroundColor Yellow
    
    try {
        $paymentData = @{
            amount = 150.00
            currency = "BRL"
            payment_method = "credit_card"
            user_id = 1
            booking_id = 1
        }
        
        $paymentResponse = Invoke-RestMethod -Uri "${baseUrl}:5005/api/payments/process" -Method POST -Body ($paymentData | ConvertTo-Json) -ContentType "application/json" -TimeoutSec 15
        Write-Host "  ✅ Pagamento: OK" -ForegroundColor Green
        Write-Host "  💰 Status: $($paymentResponse.status)" -ForegroundColor Cyan
        
        return $true
    }
    catch {
        Write-Host "  ❌ Pagamento: FALHOU - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Função para testar notificações
function Test-Notifications {
    Write-Host "`n🔔 Testando Notificações..." -ForegroundColor Yellow
    
    try {
        $notificationData = @{
            user_id = 1
            notification_type = "weather_alert"
            title = "Alerta Climático"
            message = "Tempestade detectada na região"
            action_url = "https://app.onionrsv.com/alerts"
        }
        
        $notifResponse = Invoke-RestMethod -Uri "${baseUrl}:5002/api/notifications/send" -Method POST -Body ($notificationData | ConvertTo-Json) -ContentType "application/json" -TimeoutSec 10
        Write-Host "  ✅ Notificação: OK" -ForegroundColor Green
        
        return $true
    }
    catch {
        Write-Host "  ❌ Notificação: FALHOU - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Função para testar métricas
function Test-Metrics {
    Write-Host "`n📊 Testando Métricas..." -ForegroundColor Yellow
    
    $metricsServices = @("5000", "5002", "5004", "5011", "5005", "5006")
    $successCount = 0
    
    foreach ($port in $metricsServices) {
        try {
            $metricsResponse = Invoke-RestMethod -Uri "${baseUrl}:${port}/metrics" -Method GET -TimeoutSec 10
            Write-Host "  ✅ Métricas porta $port`: OK" -ForegroundColor Green
            $successCount++
        }
        catch {
            Write-Host "  ❌ Métricas porta $port`: FALHOU" -ForegroundColor Red
        }
    }
    
    Write-Host "  📈 Total de serviços com métricas: $successCount/$($metricsServices.Count)" -ForegroundColor Cyan
    return $successCount -eq $metricsServices.Count
}

# Função para testar cluster cache
function Test-ClusterCache {
    Write-Host "`n🔄 Testando Cluster Cache..." -ForegroundColor Yellow
    
    try {
        # Testar cache distribuído
        $cacheData = @{
            key = "test_cluster_key"
            value = "test_value"
            ttl = 300
            data_type = "test"
        }
        
        $cacheSetResponse = Invoke-RestMethod -Uri "${baseUrl}:5000/api/cache/set" -Method POST -Body ($cacheData | ConvertTo-Json) -ContentType "application/json" -TimeoutSec 10
        Write-Host "  ✅ Cluster Cache Set: OK" -ForegroundColor Green
        
        $cacheGetResponse = Invoke-RestMethod -Uri "${baseUrl}:5000/api/cache/get/test_cluster_key" -Method GET -TimeoutSec 10
        Write-Host "  ✅ Cluster Cache Get: OK" -ForegroundColor Green
        
        return $true
    }
    catch {
        Write-Host "  ❌ Cluster Cache: FALHOU - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Executar testes
Write-Host "`n🔍 Testando Health Checks dos Serviços..." -ForegroundColor Yellow
$healthResults = @{}

foreach ($service in $services.GetEnumerator()) {
    $healthResults[$service.Key] = Test-ServiceHealth -serviceName $service.Key -port $service.Value
}

# Testar funcionalidades específicas
$featureResults = @{
    "Rate Limiting" = Test-RateLimiting
    "Cache" = Test-Cache
    "ML Predictions" = Test-MLPredictions
    "Chatbot" = Test-Chatbot
    "Payments" = Test-Payments
    "Notifications" = Test-Notifications
    "Metrics" = Test-Metrics
    "Cluster Cache" = Test-ClusterCache
}

# Resumo dos resultados
Write-Host "`n📋 RESUMO DOS TESTES V2.2.0" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

Write-Host "`n🏥 Health Checks:" -ForegroundColor Yellow
$healthSuccess = 0
foreach ($service in $healthResults.GetEnumerator()) {
    $status = if ($service.Value) { "✅" } else { "❌" }
    Write-Host "  $status $($service.Key): $($service.Value)" -ForegroundColor $(if ($service.Value) { "Green" } else { "Red" })
    if ($service.Value) { $healthSuccess++ }
}

Write-Host "`n🚀 Funcionalidades V2.2.0:" -ForegroundColor Yellow
$featureSuccess = 0
foreach ($feature in $featureResults.GetEnumerator()) {
    $status = if ($feature.Value) { "✅" } else { "❌" }
    Write-Host "  $status $($feature.Key): $($feature.Value)" -ForegroundColor $(if ($feature.Value) { "Green" } else { "Red" })
    if ($feature.Value) { $featureSuccess++ }
}

# Estatísticas finais
$totalServices = $services.Count
$totalFeatures = $featureResults.Count

Write-Host "`n📈 ESTATÍSTICAS FINAIS:" -ForegroundColor Cyan
Write-Host "  🏥 Serviços saudáveis: $healthSuccess/$totalServices" -ForegroundColor $(if ($healthSuccess -eq $totalServices) { "Green" } else { "Yellow" })
Write-Host "  🚀 Funcionalidades funcionando: $featureSuccess/$totalFeatures" -ForegroundColor $(if ($featureSuccess -eq $totalFeatures) { "Green" } else { "Yellow" })

$overallSuccess = if ($healthSuccess -eq $totalServices -and $featureSuccess -eq $totalFeatures) { $true } else { $false }

Write-Host "`n🎯 RESULTADO FINAL:" -ForegroundColor $(if ($overallSuccess) { "Green" } else { "Red" })
if ($overallSuccess) {
    Write-Host "  ✅ TODOS OS TESTES PASSARAM! Sistema V2.2.0 funcionando perfeitamente." -ForegroundColor Green
} else {
    Write-Host "  ❌ ALGUNS TESTES FALHARAM. Verifique os logs acima para detalhes." -ForegroundColor Red
}

Write-Host "`n🏁 Teste concluído em $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" -ForegroundColor Gray 