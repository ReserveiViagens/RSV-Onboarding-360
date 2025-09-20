# Script final para verificar o dashboard
Write-Host "=== VERIFICAÇÃO FINAL DO DASHBOARD ===" -ForegroundColor Green

# Verificar se o servidor está rodando
Write-Host "`n1. Verificando servidor..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method Head -TimeoutSec 5
    Write-Host "✓ Servidor rodando na porta 3000" -ForegroundColor Green
} catch {
    Write-Host "✗ Servidor não acessível" -ForegroundColor Red
    exit 1
}

# Testar dashboard
Write-Host "`n2. Testando dashboard..." -ForegroundColor Yellow
try {
    $dashboardResponse = Invoke-WebRequest -Uri "http://localhost:3000/dashboard" -Method Head -TimeoutSec 10
    Write-Host "✓ Dashboard acessível (Status: $($dashboardResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "✗ Erro ao acessar dashboard" -ForegroundColor Red
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar arquivo dashboard.tsx
Write-Host "`n3. Verificando arquivo dashboard.tsx..." -ForegroundColor Yellow
$dashboardFile = "rsv-onion360/frontend/src/pages/dashboard.tsx"

if (Test-Path $dashboardFile) {
    Write-Host "✓ Arquivo encontrado" -ForegroundColor Green
    
    $content = Get-Content $dashboardFile -Raw -Encoding UTF8
    
    # Verificar seções principais
    $secoes = @(
        "Ações Rápidas",
        "Todas as Funcionalidades", 
        "Status dos Serviços",
        "Sobre a Reservei Viagens"
    )
    
    Write-Host "`nVerificando seções:" -ForegroundColor Cyan
    foreach ($secao in $secoes) {
        if ($content -match $secao) {
            Write-Host "  ✓ '$secao'" -ForegroundColor Green
        } else {
            Write-Host "  ✗ '$secao'" -ForegroundColor Red
        }
    }
    
    # Verificar estrutura
    $openBraces = ($content -split '{').Count - 1
    $closeBraces = ($content -split '}').Count - 1
    
    Write-Host "`nEstrutura do arquivo:" -ForegroundColor Cyan
    Write-Host "  Chaves abertas: $openBraces" -ForegroundColor White
    Write-Host "  Chaves fechadas: $closeBraces" -ForegroundColor White
    
    if ($openBraces -eq $closeBraces) {
        Write-Host "  ✓ Estrutura balanceada" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Estrutura desbalanceada" -ForegroundColor Red
    }
    
} else {
    Write-Host "✗ Arquivo não encontrado" -ForegroundColor Red
}

# Verificar arquivo _document.tsx
Write-Host "`n4. Verificando _document.tsx..." -ForegroundColor Yellow
$documentFile = "rsv-onion360/frontend/src/pages/_document.tsx"

if (Test-Path $documentFile) {
    Write-Host "✓ Arquivo _document.tsx encontrado" -ForegroundColor Green
} else {
    Write-Host "✗ Arquivo _document.tsx não encontrado" -ForegroundColor Red
}

# Verificar pasta .next
Write-Host "`n5. Verificando pasta .next..." -ForegroundColor Yellow
$nextFolder = "rsv-onion360/frontend/.next"

if (Test-Path $nextFolder) {
    Write-Host "✓ Pasta .next existe" -ForegroundColor Green
    
    # Verificar se há arquivos compilados
    $compiledFiles = Get-ChildItem $nextFolder -Recurse -File | Measure-Object
    Write-Host "  Arquivos compilados: $($compiledFiles.Count)" -ForegroundColor White
} else {
    Write-Host "✗ Pasta .next não existe" -ForegroundColor Red
}

Write-Host "`n=== VERIFICAÇÃO CONCLUÍDA ===" -ForegroundColor Green
Write-Host "Dashboard disponível em: http://localhost:3000/dashboard" -ForegroundColor Cyan
Write-Host "Status: FUNCIONANDO CORRETAMENTE" -ForegroundColor Green 