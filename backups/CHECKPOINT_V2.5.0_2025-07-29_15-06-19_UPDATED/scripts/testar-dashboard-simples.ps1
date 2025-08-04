# Script simples para testar o dashboard
Write-Host "=== TESTE SIMPLES DO DASHBOARD ===" -ForegroundColor Green

# Verificar se o servidor está rodando
Write-Host "`n1. Verificando servidor..." -ForegroundColor Yellow
$ports = @(3000, 3001, 3002, 3003)
$serverPort = $null

foreach ($port in $ports) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$port" -Method Head -TimeoutSec 3
        Write-Host "✓ Servidor rodando na porta $port" -ForegroundColor Green
        $serverPort = $port
        break
    } catch {
        Write-Host "✗ Porta $port não acessível" -ForegroundColor Red
    }
}

if (-not $serverPort) {
    Write-Host "✗ Nenhum servidor encontrado" -ForegroundColor Red
    exit 1
}

# Testar acesso ao dashboard
Write-Host "`n2. Testando acesso ao dashboard..." -ForegroundColor Yellow
try {
    $dashboardResponse = Invoke-WebRequest -Uri "http://localhost:$serverPort/dashboard" -Method Head -TimeoutSec 10
    Write-Host "✓ Dashboard acessível" -ForegroundColor Green
} catch {
    Write-Host "✗ Erro ao acessar dashboard" -ForegroundColor Red
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar arquivo dashboard.tsx
Write-Host "`n3. Verificando arquivo dashboard.tsx..." -ForegroundColor Yellow
$dashboardFile = "rsv-onion360/frontend/src/pages/dashboard.tsx"

if (Test-Path $dashboardFile) {
    Write-Host "✓ Arquivo encontrado" -ForegroundColor Green
    
    # Verificar tamanho do arquivo
    $fileSize = (Get-Item $dashboardFile).Length
    Write-Host "Tamanho do arquivo: $fileSize bytes" -ForegroundColor Cyan
    
    # Verificar se contém as seções principais
    $content = Get-Content $dashboardFile -Raw -Encoding UTF8
    
    $secoes = @(
        "Ações Rápidas",
        "Todas as Funcionalidades", 
        "Status dos Serviços",
        "Sobre a Reservei Viagens"
    )
    
    foreach ($secao in $secoes) {
        if ($content -match $secao) {
            Write-Host "✓ Seção '$secao' encontrada" -ForegroundColor Green
        } else {
            Write-Host "✗ Seção '$secao' não encontrada" -ForegroundColor Red
        }
    }
    
    # Verificar estrutura básica
    $openBraces = ($content -split '{').Count - 1
    $closeBraces = ($content -split '}').Count - 1
    
    Write-Host "Chaves abertas: $openBraces" -ForegroundColor Cyan
    Write-Host "Chaves fechadas: $closeBraces" -ForegroundColor Cyan
    
    if ($openBraces -eq $closeBraces) {
        Write-Host "✓ Estrutura básica parece estar correta" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Possível problema na estrutura" -ForegroundColor Yellow
    }
    
} else {
    Write-Host "✗ Arquivo não encontrado" -ForegroundColor Red
}

Write-Host "`n=== TESTE CONCLUÍDO ===" -ForegroundColor Green
Write-Host "Acesse http://localhost:$serverPort/dashboard para verificar" -ForegroundColor Cyan 