# 🌐 TESTE DE LOAD BALANCER - ONION RSV 360
# Script para validar funcionamento do Nginx como reverse proxy

param(
    [int]$Requests = 50,
    [int]$Concurrent = 5
)

Write-Host "🌐 TESTANDO LOAD BALANCER NGINX" -ForegroundColor Green
Write-Host "Requests: $Requests | Concorrência: $Concurrent" -ForegroundColor Yellow
Write-Host ""

# URLs para teste
$testUrls = @(
    @{Name = "Load Balancer Status"; Url = "http://localhost/api/status" },
    @{Name = "Core via LB"; Url = "http://localhost/api/core/health" },
    @{Name = "Travel via LB"; Url = "http://localhost/api/travel/health" },
    @{Name = "Finance via LB"; Url = "http://localhost/api/finance/health" },
    @{Name = "Payments via LB"; Url = "http://localhost/api/payments/health" },
    @{Name = "Nginx Status"; Url = "http://localhost:8080/nginx_status" },
    @{Name = "Nginx Health"; Url = "http://localhost:8080/health" }
)

$results = @()
$totalTime = Measure-Command {
    
    foreach ($test in $testUrls) {
        Write-Host "🧪 Testando: $($test.Name)" -ForegroundColor Cyan
        
        $successCount = 0
        $totalResponseTime = 0
        $minTime = [double]::MaxValue
        $maxTime = 0
        
        # Teste sequencial básico
        for ($i = 1; $i -le 10; $i++) {
            try {
                $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
                $response = Invoke-WebRequest -Uri $test.Url -TimeoutSec 10 -ErrorAction Stop
                $stopwatch.Stop()
                
                $responseTime = $stopwatch.ElapsedMilliseconds
                $totalResponseTime += $responseTime
                $successCount++
                
                if ($responseTime -lt $minTime) { $minTime = $responseTime }
                if ($responseTime -gt $maxTime) { $maxTime = $responseTime }
                
                Write-Host "  ✅ Request $i - $($responseTime)ms - Status: $($response.StatusCode)" -ForegroundColor Green
                
            }
            catch {
                Write-Host "  ❌ Request $i - FALHOU: $($_.Exception.Message)" -ForegroundColor Red
            }
            
            Start-Sleep -Milliseconds 100
        }
        
        $avgTime = if ($successCount -gt 0) { [math]::Round($totalResponseTime / $successCount, 1) } else { 0 }
        $successRate = [math]::Round(($successCount / 10) * 100, 1)
        
        $results += @{
            Service       = $test.Name
            SuccessRate   = $successRate
            AvgTime       = $avgTime
            MinTime       = if ($minTime -eq [double]::MaxValue) { 0 } else { $minTime }
            MaxTime       = $maxTime
            TotalRequests = 10
            Successful    = $successCount
        }
        
        Write-Host ""
    }
}

Write-Host "📊 RESULTADOS DO TESTE DE LOAD BALANCER" -ForegroundColor Yellow
Write-Host "=" * 80
Write-Host ("| {0,-25} | {1,-8} | {2,-8} | {3,-8} | {4,-8} |" -f "Serviço", "Success%", "Avg(ms)", "Min(ms)", "Max(ms)")
Write-Host "=" * 80

$totalSuccess = 0
$totalRequests = 0
$totalAvgTime = 0
$serviceCount = 0

foreach ($result in $results) {
    Write-Host ("| {0,-25} | {1,-8} | {2,-8} | {3,-8} | {4,-8} |" -f 
        $result.Service, 
        "$($result.SuccessRate)%", 
        $result.AvgTime, 
        $result.MinTime, 
        $result.MaxTime
    ) -ForegroundColor $(if ($result.SuccessRate -eq 100) { "Green" } else { "Yellow" })
    
    $totalSuccess += $result.Successful
    $totalRequests += $result.TotalRequests
    $totalAvgTime += $result.AvgTime
    $serviceCount++
}

Write-Host "=" * 80

$overallSuccessRate = [math]::Round(($totalSuccess / $totalRequests) * 100, 1)
$overallAvgTime = [math]::Round($totalAvgTime / $serviceCount, 1)

Write-Host ""
Write-Host "🎯 RESUMO GERAL:" -ForegroundColor Green
Write-Host "• Total de requests: $totalRequests"
Write-Host "• Requests bem-sucedidos: $totalSuccess"
Write-Host "• Taxa de sucesso geral: $overallSuccessRate%"
Write-Host "• Tempo médio geral: $overallAvgTime ms"
Write-Host "• Tempo total do teste: $($totalTime.TotalSeconds) segundos"

# Teste de carga específico do load balancer
Write-Host ""
Write-Host "🔥 TESTE DE CARGA NO LOAD BALANCER" -ForegroundColor Magenta

$loadTestUrl = "http://localhost/api/status"
$loadTestRequests = 50
$successfulLoads = 0
$loadTimes = @()

Write-Host "Fazendo $loadTestRequests requests para $loadTestUrl..."

for ($i = 1; $i -le $loadTestRequests; $i++) {
    try {
        $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
        Invoke-WebRequest -Uri $loadTestUrl -TimeoutSec 5 -ErrorAction Stop | Out-Null
        $stopwatch.Stop()
        
        $loadTimes += $stopwatch.ElapsedMilliseconds
        $successfulLoads++
        
        if ($i % 10 -eq 0) {
            Write-Host "  Completado: $i/$loadTestRequests requests" -ForegroundColor Gray
        }
        
    }
    catch {
        Write-Host "  ❌ Request $i falhou" -ForegroundColor Red
    }
}

if ($loadTimes.Count -gt 0) {
    $avgLoadTime = [math]::Round(($loadTimes | Measure-Object -Average).Average, 1)
    $minLoadTime = ($loadTimes | Measure-Object -Minimum).Minimum
    $maxLoadTime = ($loadTimes | Measure-Object -Maximum).Maximum
    $p95LoadTime = [math]::Round(($loadTimes | Sort-Object)[[math]::Floor($loadTimes.Count * 0.95)], 1)
    
    Write-Host ""
    Write-Host "📈 RESULTADOS DO TESTE DE CARGA:" -ForegroundColor Yellow
    Write-Host "• Requests realizados: $loadTestRequests"
    Write-Host "• Requests bem-sucedidos: $successfulLoads"
    Write-Host "• Taxa de sucesso: $([math]::Round(($successfulLoads / $loadTestRequests) * 100, 1))%"
    Write-Host "• Tempo médio: $avgLoadTime ms"
    Write-Host "• Tempo mínimo: $minLoadTime ms"
    Write-Host "• Tempo máximo: $maxLoadTime ms"
    Write-Host "• P95: $p95LoadTime ms"
}

# Verificar status do nginx
Write-Host ""
Write-Host "🔍 VERIFICANDO STATUS DO NGINX" -ForegroundColor Blue

try {
    $nginxStatus = Invoke-WebRequest -Uri "http://localhost:8080/nginx_status" -TimeoutSec 5
    Write-Host "✅ Nginx status obtido com sucesso:" -ForegroundColor Green
    Write-Host $nginxStatus.Content
}
catch {
    Write-Host "❌ Não foi possível obter status do Nginx: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
if ($overallSuccessRate -eq 100) {
    Write-Host "🏆 LOAD BALANCER FUNCIONANDO PERFEITAMENTE!" -ForegroundColor Green
    Write-Host "✅ Todos os serviços estão respondendo via proxy" -ForegroundColor Green
}
elseif ($overallSuccessRate -ge 90) {
    Write-Host "⚠️ Load balancer funcionando com alguns problemas" -ForegroundColor Yellow
    Write-Host "🔧 Verifique os serviços que falharam" -ForegroundColor Yellow
}
else {
    Write-Host "❌ Load balancer com problemas sérios" -ForegroundColor Red
    Write-Host "🚨 Verificar configuração do Nginx e serviços" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 Para debug detalhado, verifique:" -ForegroundColor Cyan
Write-Host "• docker compose logs nginx"
Write-Host "• curl http://localhost:8080/nginx_status"
Write-Host "• curl http://localhost/api/status"