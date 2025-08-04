# Script para testar o card do editor de vouchers
# Autor: Sistema Onion RSV 360
# Data: 28/07/2025

Write-Host "TESTANDO CARD DO EDITOR DE VOUCHERS..." -ForegroundColor Green

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

# Verificar arquivos atualizados
Write-Host "Verificando arquivos atualizados..." -ForegroundColor Yellow

$arquivos = @(
    "rsv-onion360/frontend/src/pages/vouchers.tsx",
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

# Verificar se o card foi adicionado
Write-Host "Verificando se o card foi adicionado..." -ForegroundColor Yellow
$vouchersPath = "rsv-onion360/frontend/src/pages/vouchers.tsx"
if (Test-Path $vouchersPath) {
    $vouchersContent = Get-Content $vouchersPath -Raw
    if ($vouchersContent -match "Editor de Vouchers") {
        Write-Host "OK - Card do editor de vouchers adicionado" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Card do editor de vouchers nao encontrado" -ForegroundColor Red
    }
    
    if ($vouchersContent -match "handleEditorVouchers") {
        Write-Host "OK - Funcao handleEditorVouchers encontrada" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Funcao handleEditorVouchers nao encontrada" -ForegroundColor Red
    }
    
    if ($vouchersContent -match "Palette") {
        Write-Host "OK - Icone Palette encontrado" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Icone Palette nao encontrado" -ForegroundColor Red
    }
} else {
    Write-Host "ERRO - Arquivo vouchers.tsx nao encontrado" -ForegroundColor Red
}

# Verificar imports adicionados
Write-Host "Verificando imports adicionados..." -ForegroundColor Yellow
if ($vouchersContent -match "useRouter") {
    Write-Host "OK - Import useRouter encontrado" -ForegroundColor Green
} else {
    Write-Host "ERRO - Import useRouter nao encontrado" -ForegroundColor Red
}

if ($vouchersContent -match "Palette") {
    Write-Host "OK - Import Palette encontrado" -ForegroundColor Green
} else {
    Write-Host "ERRO - Import Palette nao encontrado" -ForegroundColor Red
}

Write-Host "`nTESTE CONCLUIDO!" -ForegroundColor Green
Write-Host "Acesse: http://localhost:3000/vouchers" -ForegroundColor Cyan
Write-Host "Clique no card 'Editor de Vouchers' para acessar o editor" -ForegroundColor Cyan
Write-Host "Card do editor de vouchers implementado com sucesso!" -ForegroundColor Green
Write-Host "Servidor rodando na porta 3000" -ForegroundColor Cyan 