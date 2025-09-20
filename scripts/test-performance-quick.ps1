# 🚀 TESTE RÁPIDO DE PERFORMANCE - ONION RSV 360
# Verificação instantânea de todos os 32 microserviços

Write-Host "🚀 TESTE RÁPIDO DE PERFORMANCE - SISTEMA ONION RSV 360" -ForegroundColor Green
Write-Host "📊 Verificando 32 microserviços..." -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

$services = @(
    "core:5000", "travel:5003", "finance:5005", "tickets:5006",
    "attractions:5009", "payments:5007", "ecommerce:5008",
    "vouchers:5010", "voucher-editor:5011", "giftcards:5012",
    "coupons:5013", "parks:5014", "maps:5015", "visa:5016",
    "marketing:5017", "subscriptions:5018", "seo:5019",
    "multilingual:5020", "videos:5021", "photos:5022",
    "admin:5023", "analytics:5024", "reports:5025", "data:5026",
    "notifications:5027", "reviews:5028", "rewards:5029",
    "loyalty:5030", "sales:5031", "sectoral_finance:5032",
    "refunds:5033", "inventory:5034"
)

$results = @()
$working = 0

foreach ($service in $services) {
    $name, $port = $service -split ":"
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$port/health" -TimeoutSec 5 -ErrorAction Stop
        $stopwatch.Stop()
        $responseTime = $stopwatch.ElapsedMilliseconds
        
        $color = if ($responseTime -lt 100) { "Green" } 
        elseif ($responseTime -lt 500) { "Yellow" } 
        else { "Red" }
        
        $timeStr = "$($responseTime)ms"
        Write-Host "✅ $($name.PadRight(18)) | $($timeStr.PadLeft(6)) | :$port" -ForegroundColor $color
        
        $results += @{
            Name         = $name
            Port         = $port
            ResponseTime = $responseTime
            Status       = "OK"
        }
        $working++
        
    }
    catch {
        $stopwatch.Stop()
        Write-Host "❌ $($name.PadRight(18)) | ERROR  | :$port" -ForegroundColor Red
        
        $results += @{
            Name         = $name
            Port         = $port
            ResponseTime = 0
            Status       = "ERROR"
        }
    }
}

Write-Host "=" * 60 -ForegroundColor Gray

# Estatísticas finais
$healthyServices = $results | Where-Object { $_.Status -eq "OK" }
$avgResponseTime = if ($healthyServices.Count -gt 0) { 
    [math]::Round(($healthyServices | Measure-Object ResponseTime -Average).Average, 2) 
}
else { 0 }
$maxResponseTime = if ($healthyServices.Count -gt 0) { 
    ($healthyServices | Measure-Object ResponseTime -Maximum).Maximum 
}
else { 0 }
$minResponseTime = if ($healthyServices.Count -gt 0) { 
    ($healthyServices | Measure-Object ResponseTime -Minimum).Minimum 
}
else { 0 }

Write-Host "📊 RESULTADO FINAL:" -ForegroundColor Yellow
Write-Host "   ✅ Serviços Ativos: $working/32" -ForegroundColor Green
Write-Host "   ⚡ Tempo Médio: $($avgResponseTime)ms" -ForegroundColor Cyan
Write-Host "   🚀 Mais Rápido: $($minResponseTime)ms" -ForegroundColor Green
Write-Host "   🐌 Mais Lento: $($maxResponseTime)ms" -ForegroundColor Yellow

if ($working -eq 32) {
    if ($avgResponseTime -lt 200) {
        Write-Host "`n🏆 PERFORMANCE EXCELENTE! Sistema 100% operacional com ótima velocidade!" -ForegroundColor Green
    }
    elseif ($avgResponseTime -lt 500) {
        Write-Host "`n✅ PERFORMANCE BOA! Sistema 100% operacional com velocidade adequada!" -ForegroundColor Yellow
    }
    else {
        Write-Host "`n⚠️ PERFORMANCE LENTA! Sistema operacional mas com latência alta!" -ForegroundColor Red
    }
}
else {
    Write-Host "`n⚠️ SISTEMA PARCIAL: $working/32 microserviços funcionando" -ForegroundColor Red
}

$timestamp = Get-Date -Format "dd/MM/yyyy HH:mm:ss"
Write-Host "`n📅 Teste realizado em: $timestamp" -ForegroundColor Gray