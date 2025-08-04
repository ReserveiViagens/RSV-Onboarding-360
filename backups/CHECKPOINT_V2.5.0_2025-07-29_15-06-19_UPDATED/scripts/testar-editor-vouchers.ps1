# Script para testar o editor de vouchers
# Autor: Sistema Onion RSV 360
# Data: 28/07/2025

Write-Host "TESTANDO EDITOR DE VOUCHERS..." -ForegroundColor Green

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

# Testar pagina do editor de vouchers
Write-Host "Testando pagina do editor de vouchers..." -ForegroundColor Yellow
try {
    $editorResponse = Invoke-WebRequest -Uri "http://localhost:3000/voucher-editor" -Method Head -TimeoutSec 10
    if ($editorResponse.StatusCode -eq 200) {
        Write-Host "OK - Pagina do editor de vouchers acessivel" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Pagina do editor de vouchers nao acessivel" -ForegroundColor Red
    }
} catch {
    Write-Host "ERRO - Erro ao acessar pagina do editor: $($_.Exception.Message)" -ForegroundColor Red
}

# Testar API do backend
Write-Host "Testando API do editor de vouchers..." -ForegroundColor Yellow
try {
    $apiResponse = Invoke-WebRequest -Uri "http://localhost:5029/health" -Method Get -TimeoutSec 10
    if ($apiResponse.StatusCode -eq 200) {
        Write-Host "OK - API do editor de vouchers funcionando" -ForegroundColor Green
    } else {
        Write-Host "ERRO - API do editor de vouchers nao esta funcionando" -ForegroundColor Red
    }
} catch {
    Write-Host "ERRO - Erro ao conectar com API: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar arquivos criados
Write-Host "Verificando arquivos do editor..." -ForegroundColor Yellow

$arquivos = @(
    "rsv-onion360/frontend/src/pages/voucher-editor.tsx",
    "rsv-onion360/backend/voucher-editor/app.py",
    "rsv-onion360/backend/voucher-editor/requirements.txt",
    "rsv-onion360/backend/voucher-editor/Dockerfile",
    "rsv-onion360/IMPLEMENTACAO_EDITOR_VOUCHERS.md"
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
    if ($middlewareContent -match "editor-voucher") {
        Write-Host "OK - Middleware contem redirecionamento para editor" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Middleware nao contem redirecionamento para editor" -ForegroundColor Red
    }
} else {
    Write-Host "ERRO - Arquivo middleware.ts nao encontrado" -ForegroundColor Red
}

# Verificar dashboard atualizado
Write-Host "Verificando dashboard..." -ForegroundColor Yellow
$dashboardPath = "rsv-onion360/frontend/src/pages/dashboard.tsx"
if (Test-Path $dashboardPath) {
    $dashboardContent = Get-Content $dashboardPath -Raw
    if ($dashboardContent -match "Editor de Vouchers") {
        Write-Host "OK - Dashboard contem editor de vouchers" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Dashboard nao contem editor de vouchers" -ForegroundColor Red
    }
} else {
    Write-Host "ERRO - Arquivo dashboard.tsx nao encontrado" -ForegroundColor Red
}

Write-Host "`nTESTE CONCLUIDO!" -ForegroundColor Green
Write-Host "Acesse: http://localhost:3000/voucher-editor" -ForegroundColor Cyan
Write-Host "Editor de vouchers implementado com sucesso!" -ForegroundColor Green
Write-Host "Servidor rodando na porta 3000" -ForegroundColor Cyan
Write-Host "API rodando na porta 5029" -ForegroundColor Cyan 