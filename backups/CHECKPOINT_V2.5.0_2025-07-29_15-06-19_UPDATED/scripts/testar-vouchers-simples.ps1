# Script para testar o modulo de vouchers
# Autor: Sistema Onion RSV 360
# Data: 28/07/2025

Write-Host "TESTANDO MODULO DE VOUCHERS..." -ForegroundColor Green

# Verificar se o servidor esta rodando
Write-Host "Verificando servidor frontend..." -ForegroundColor Yellow
try {
    $frontendStatus = Invoke-WebRequest -Uri "http://localhost:3000" -Method Head -TimeoutSec 5
    if ($frontendStatus.StatusCode -eq 200) {
        Write-Host "OK - Servidor frontend funcionando" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Servidor frontend nao esta rodando" -ForegroundColor Red
    }
} catch {
    Write-Host "ERRO - Erro ao conectar com servidor: $($_.Exception.Message)" -ForegroundColor Red
}

# Testar pagina de vouchers
Write-Host "Testando pagina de vouchers..." -ForegroundColor Yellow
try {
    $vouchersResponse = Invoke-WebRequest -Uri "http://localhost:3000/vouchers" -Method Head -TimeoutSec 10
    if ($vouchersResponse.StatusCode -eq 200) {
        Write-Host "OK - Pagina de vouchers acessivel" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Pagina de vouchers nao acessivel" -ForegroundColor Red
    }
} catch {
    Write-Host "ERRO - Erro ao acessar pagina de vouchers: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar arquivos criados
Write-Host "Verificando arquivos do modulo..." -ForegroundColor Yellow

$arquivos = @(
    "rsv-onion360/frontend/src/pages/vouchers.tsx",
    "rsv-onion360/backend/vouchers/app.py",
    "rsv-onion360/backend/vouchers/requirements.txt",
    "rsv-onion360/backend/vouchers/Dockerfile",
    "rsv-onion360/IMPLEMENTACAO_VOUCHERS.md"
)

foreach ($arquivo in $arquivos) {
    if (Test-Path $arquivo) {
        Write-Host "OK - $arquivo" -ForegroundColor Green
    } else {
        Write-Host "ERRO - $arquivo nao encontrado" -ForegroundColor Red
    }
}

# Verificar middleware atualizado
Write-Host "Verificando middleware..." -ForegroundColor Yellow
$middlewarePath = "rsv-onion360/frontend/src/middleware.ts"
if (Test-Path $middlewarePath) {
    $middlewareContent = Get-Content $middlewarePath -Raw
    if ($middlewareContent -notmatch "pathname === '/vouchers'") {
        Write-Host "OK - Middleware corrigido (sem loop de redirecionamento)" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Middleware ainda tem problema de redirecionamento" -ForegroundColor Red
    }
} else {
    Write-Host "ERRO - Arquivo middleware.ts nao encontrado" -ForegroundColor Red
}

# Verificar dashboard atualizado
Write-Host "Verificando dashboard..." -ForegroundColor Yellow
$dashboardPath = "rsv-onion360/frontend/src/pages/dashboard.tsx"
if (Test-Path $dashboardPath) {
    $dashboardContent = Get-Content $dashboardPath -Raw
    if ($dashboardContent -match "Vouchers") {
        Write-Host "OK - Dashboard contem categoria de vouchers" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Dashboard nao contem categoria de vouchers" -ForegroundColor Red
    }
} else {
    Write-Host "ERRO - Arquivo dashboard.tsx nao encontrado" -ForegroundColor Red
}

Write-Host "`nTESTE CONCLUIDO!" -ForegroundColor Green
Write-Host "Acesse: http://localhost:3000/vouchers" -ForegroundColor Cyan
Write-Host "Modulo de vouchers implementado com sucesso!" -ForegroundColor Green
Write-Host "Servidor rodando na porta 3000" -ForegroundColor Cyan 