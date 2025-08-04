# 📈 SCRIPT DE MONITORAMENTO DE PERFORMANCE - ONION RSV 360
# Sistema 100% Operacional - 32 Microserviços

param(
    [int]$IntervalSeconds = 30,
    [int]$MaxIterations = 0,  # 0 = infinito
    [string]$LogFile = "logs/performance-monitor.log"
)

# Criar diretório de logs se não existir
$logDir = Split-Path $LogFile -Parent
if ($logDir -and !(Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

Write-Host "🚀 INICIANDO MONITORAMENTO DE PERFORMANCE - ONION RSV 360" -ForegroundColor Green
Write-Host "📊 Monitorando 32 microserviços ativos" -ForegroundColor Cyan
Write-Host "⏱️ Intervalo: $IntervalSeconds segundos" -ForegroundColor Yellow
Write-Host "📝 Log: $LogFile" -ForegroundColor Blue
Write-Host "=" * 70 -ForegroundColor Gray

# Lista de todos os 32 microserviços
$services = @(
    @{Name="core"; Port=5000; Group="Core Services"},
    @{Name="travel"; Port=5003; Group="Core Services"},
    @{Name="finance"; Port=5005; Group="Core Services"},
    @{Name="tickets"; Port=5006; Group="Core Services"},
    @{Name="attractions"; Port=5009; Group="Core Services"},
    @{Name="payments"; Port=5007; Group="Business Services"},
    @{Name="ecommerce"; Port=5008; Group="Business Services"},
    @{Name="vouchers"; Port=5010; Group="Business Services"},
    @{Name="voucher-editor"; Port=5011; Group="Business Services"},
    @{Name="giftcards"; Port=5012; Group="Business Services"},
    @{Name="coupons"; Port=5013; Group="Business Services"},
    @{Name="parks"; Port=5014; Group="Specialized Services"},
    @{Name="maps"; Port=5015; Group="Specialized Services"},
    @{Name="visa"; Port=5016; Group="Specialized Services"},
    @{Name="marketing"; Port=5017; Group="Specialized Services"},
    @{Name="subscriptions"; Port=5018; Group="Specialized Services"},
    @{Name="seo"; Port=5019; Group="Specialized Services"},
    @{Name="multilingual"; Port=5020; Group="Specialized Services"},
    @{Name="videos"; Port=5021; Group="Specialized Services"},
    @{Name="photos"; Port=5022; Group="Specialized Services"},
    @{Name="admin"; Port=5023; Group="Management Systems"},
    @{Name="analytics"; Port=5024; Group="Management Systems"},
    @{Name="reports"; Port=5025; Group="Management Systems"},
    @{Name="data"; Port=5026; Group="Management Systems"},
    @{Name="notifications"; Port=5027; Group="User Services"},
    @{Name="reviews"; Port=5028; Group="User Services"},
    @{Name="rewards"; Port=5029; Group="User Services"},
    @{Name="loyalty"; Port=5030; Group="User Services"},
    @{Name="sales"; Port=5031; Group="Business Operations"},
    @{Name="sectoral_finance"; Port=5032; Group="Business Operations"},
    @{Name="refunds"; Port=5033; Group="Business Operations"},
    @{Name="inventory"; Port=5034; Group="Business Operations"}
)

function Test-ServicePerformance {
    param($service)
    
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$($service.Port)/health" -TimeoutSec 10 -ErrorAction Stop
        $stopwatch.Stop()
        
        return @{
            Name = $service.Name
            Port = $service.Port
            Group = $service.Group
            Status = "OK"
            ResponseTime = $stopwatch.ElapsedMilliseconds
            StatusCode = $response.StatusCode
            Error = $null
        }
    } catch {
        $stopwatch.Stop()
        return @{
            Name = $service.Name
            Port = $service.Port
            Group = $service.Group
            Status = "ERROR"
            ResponseTime = $stopwatch.ElapsedMilliseconds
            StatusCode = $null
            Error = $_.Exception.Message
        }
    }
}

function Show-PerformanceReport {
    param($results)
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    # Estatísticas gerais
    $totalServices = $results.Count
    $healthyServices = ($results | Where-Object { $_.Status -eq "OK" }).Count
    $errorServices = $totalServices - $healthyServices
    $avgResponseTime = [math]::Round(($results | Where-Object { $_.Status -eq "OK" } | Measure-Object ResponseTime -Average).Average, 2)
    $maxResponseTime = ($results | Where-Object { $_.Status -eq "OK" } | Measure-Object ResponseTime -Maximum).Maximum
    $minResponseTime = ($results | Where-Object { $_.Status -eq "OK" } | Measure-Object ResponseTime -Minimum).Minimum
    
    # Header do relatório
    Clear-Host
    Write-Host "🚀 MONITORAMENTO DE PERFORMANCE - ONION RSV 360" -ForegroundColor Green
    Write-Host "📅 $timestamp" -ForegroundColor Cyan
    Write-Host "=" * 70 -ForegroundColor Gray
    
    # Estatísticas resumidas
    Write-Host "📊 RESUMO GERAL:" -ForegroundColor Yellow
    Write-Host "   ✅ Serviços Ativos: $healthyServices/$totalServices" -ForegroundColor Green
    if ($errorServices -gt 0) {
        Write-Host "   ❌ Serviços com Erro: $errorServices" -ForegroundColor Red
    }
    Write-Host "   ⚡ Tempo Médio: ${avgResponseTime}ms" -ForegroundColor Cyan
    Write-Host "   🚀 Mais Rápido: ${minResponseTime}ms" -ForegroundColor Green
    Write-Host "   🐌 Mais Lento: ${maxResponseTime}ms" -ForegroundColor Yellow
    Write-Host ""
    
    # Agrupar por categoria
    $groups = $results | Group-Object Group
    
    foreach ($group in $groups) {
        $groupHealthy = ($group.Group | Where-Object { $_.Status -eq "OK" }).Count
        $groupTotal = $group.Count
        $groupAvg = if ($groupHealthy -gt 0) { 
            [math]::Round(($group.Group | Where-Object { $_.Status -eq "OK" } | Measure-Object ResponseTime -Average).Average, 2) 
        } else { 0 }
        
        $statusColor = if ($groupHealthy -eq $groupTotal) { "Green" } elseif ($groupHealthy -eq 0) { "Red" } else { "Yellow" }
        
        Write-Host "📋 $($group.Name) ($groupHealthy/$groupTotal) - Média: ${groupAvg}ms" -ForegroundColor $statusColor
        
        foreach ($service in $group.Group | Sort-Object ResponseTime) {
            $statusIcon = if ($service.Status -eq "OK") { "✅" } else { "❌" }
            $name = $service.Name.PadRight(18)
            $responseTime = if ($service.Status -eq "OK") { "$($service.ResponseTime)ms".PadLeft(6) } else { "ERROR".PadLeft(6) }
            
            if ($service.Status -eq "OK") {
                $color = if ($service.ResponseTime -lt 100) { "Green" } 
                        elseif ($service.ResponseTime -lt 500) { "Yellow" } 
                        else { "Red" }
                Write-Host "   $statusIcon $name | $responseTime | :$($service.Port)" -ForegroundColor $color
            } else {
                Write-Host "   $statusIcon $name | $responseTime | :$($service.Port)" -ForegroundColor Red
            }
        }
        Write-Host ""
    }
    
    # Log das informações
    $logEntry = "$timestamp | Ativos: $healthyServices/$totalServices | Média: ${avgResponseTime}ms | Min: ${minResponseTime}ms | Max: ${maxResponseTime}ms"
    Add-Content -Path $LogFile -Value $logEntry
    
    # Alertas de performance
    if ($avgResponseTime -gt 1000) {
        Write-Host "⚠️ ALERTA: Tempo de resposta médio alto (${avgResponseTime}ms)" -ForegroundColor Red
    }
    
    if ($errorServices -gt 0) {
        Write-Host "🚨 ALERTA: $errorServices serviços com erro!" -ForegroundColor Red
    }
    
    # Status geral
    if ($healthyServices -eq $totalServices -and $avgResponseTime -lt 500) {
        Write-Host "🏆 SISTEMA EXCELENTE: Todos os serviços ativos com boa performance!" -ForegroundColor Green
    } elseif ($healthyServices -eq $totalServices) {
        Write-Host "✅ SISTEMA ESTÁVEL: Todos os serviços ativos" -ForegroundColor Yellow
    } else {
        Write-Host "⚠️ SISTEMA INSTÁVEL: Alguns serviços com problemas" -ForegroundColor Red
    }
}

# Loop principal de monitoramento
$iteration = 0
while ($MaxIterations -eq 0 -or $iteration -lt $MaxIterations) {
    $iteration++
    
    Write-Host "🔄 Executando verificação #$iteration..." -ForegroundColor Blue
    
    # Testar todos os serviços
    $results = @()
    foreach ($service in $services) {
        $results += Test-ServicePerformance -service $service
    }
    
    # Mostrar relatório
    Show-PerformanceReport -results $results
    
    if ($MaxIterations -eq 0 -or $iteration -lt $MaxIterations) {
        Write-Host "⏳ Próxima verificação em $IntervalSeconds segundos... (Ctrl+C para parar)" -ForegroundColor Gray
        Start-Sleep -Seconds $IntervalSeconds
    }
}

Write-Host "✅ Monitoramento finalizado." -ForegroundColor Green