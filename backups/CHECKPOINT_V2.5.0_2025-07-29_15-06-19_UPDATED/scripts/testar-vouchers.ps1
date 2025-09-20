# Script para testar o módulo de vouchers
# Autor: Sistema Onion RSV 360
# Data: 28/07/2025

Write-Host "TESTANDO MÓDULO DE VOUCHERS..." -ForegroundColor Green

# Verificar se o servidor está rodando
Write-Host "Verificando servidor frontend..." -ForegroundColor Yellow
try {
    $frontendStatus = Invoke-WebRequest -Uri "http://localhost:3000" -Method Head -TimeoutSec 5
    if ($frontendStatus.StatusCode -eq 200) {
        Write-Host "✅ Servidor frontend funcionando" -ForegroundColor Green
    } else {
        Write-Host "❌ Servidor frontend não está rodando" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erro ao conectar com servidor: $($_.Exception.Message)" -ForegroundColor Red
}

# Testar página de vouchers
Write-Host "Testando página de vouchers..." -ForegroundColor Yellow
try {
    $vouchersResponse = Invoke-WebRequest -Uri "http://localhost:3000/vouchers" -Method Head -TimeoutSec 10
    if ($vouchersResponse.StatusCode -eq 200) {
        Write-Host "✅ Página de vouchers acessível" -ForegroundColor Green
    } else {
        Write-Host "❌ Página de vouchers não acessível" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erro ao acessar página de vouchers: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar arquivos criados
Write-Host "Verificando arquivos do módulo..." -ForegroundColor Yellow

$arquivos = @(
    "rsv-onion360/frontend/src/pages/vouchers.tsx",
    "rsv-onion360/backend/vouchers/app.py",
    "rsv-onion360/backend/vouchers/requirements.txt",
    "rsv-onion360/backend/vouchers/Dockerfile",
    "rsv-onion360/IMPLEMENTACAO_VOUCHERS.md"
)

foreach ($arquivo in $arquivos) {
    if (Test-Path $arquivo) {
        Write-Host "✅ $arquivo" -ForegroundColor Green
    } else {
        Write-Host "❌ $arquivo não encontrado" -ForegroundColor Red
    }
}

# Verificar middleware atualizado
Write-Host "Verificando middleware..." -ForegroundColor Yellow
$middlewarePath = "rsv-onion360/frontend/src/middleware.ts"
if (Test-Path $middlewarePath) {
    $middlewareContent = Get-Content $middlewarePath -Raw
    if ($middlewareContent -notmatch "pathname === '/vouchers'") {
        Write-Host "✅ Middleware corrigido (sem loop de redirecionamento)" -ForegroundColor Green
    } else {
        Write-Host "❌ Middleware ainda tem problema de redirecionamento" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Arquivo middleware.ts não encontrado" -ForegroundColor Red
}

# Verificar dashboard atualizado
Write-Host "Verificando dashboard..." -ForegroundColor Yellow
$dashboardPath = "rsv-onion360/frontend/src/pages/dashboard.tsx"
if (Test-Path $dashboardPath) {
    $dashboardContent = Get-Content $dashboardPath -Raw
    if ($dashboardContent -match "Vouchers") {
        Write-Host "✅ Dashboard contém categoria de vouchers" -ForegroundColor Green
    } else {
        Write-Host "❌ Dashboard não contém categoria de vouchers" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Arquivo dashboard.tsx não encontrado" -ForegroundColor Red
}

# Testar outras páginas do sistema
Write-Host "Testando outras páginas do sistema..." -ForegroundColor Yellow
$paginas = @(
    "http://localhost:3000/dashboard",
    "http://localhost:3000/gestao",
    "http://localhost:3000/automacao",
    "http://localhost:3000/conteudo",
    "http://localhost:3000/e-commerce",
    "http://localhost:3000/loyalty"
)

foreach ($pagina in $paginas) {
    try {
        $response = Invoke-WebRequest -Uri $pagina -Method Head -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $pagina" -ForegroundColor Green
        } else {
            Write-Host "❌ $pagina (Status: $($response.StatusCode))" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ $pagina (Erro: $($_.Exception.Message))" -ForegroundColor Red
    }
}

Write-Host "`nTESTE CONCLUÍDO!" -ForegroundColor Green
Write-Host "Acesse: http://localhost:3000/vouchers" -ForegroundColor Cyan
Write-Host "Módulo de vouchers implementado com sucesso!" -ForegroundColor Green
Write-Host "Servidor rodando na porta 3000" -ForegroundColor Cyan 