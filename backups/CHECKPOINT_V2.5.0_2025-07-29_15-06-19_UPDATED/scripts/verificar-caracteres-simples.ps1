Write-Host "=== VERIFICAÇÃO DE CARACTERES ESPECIAIS ===" -ForegroundColor Green

# Verificar arquivos principais
$files = @(
    "rsv-onion360/frontend/src/pages/dashboard.tsx",
    "rsv-onion360/frontend/src/pages/login.tsx",
    "rsv-onion360/frontend/src/pages/_document.tsx",
    "rsv-onion360/frontend/src/pages/gestao.tsx",
    "rsv-onion360/frontend/src/pages/automacao.tsx"
)

Write-Host "`nVerificando arquivos principais..." -ForegroundColor Yellow

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Verificando: $file" -ForegroundColor Cyan
        
        try {
            $content = Get-Content $file -Raw -Encoding UTF8
            $specialChars = $content -match '[^\x00-\x7F]'
            
            if ($specialChars) {
                Write-Host "  ✗ Caracteres especiais encontrados" -ForegroundColor Red
            } else {
                Write-Host "  ✓ OK" -ForegroundColor Green
            }
        } catch {
            Write-Host "  ⚠ Erro ao ler arquivo" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ⚠ Arquivo não encontrado" -ForegroundColor Yellow
    }
}

Write-Host "`nVerificando servidor..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/dashboard" -Method Head -TimeoutSec 5
    Write-Host "✓ Dashboard acessível (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "✗ Erro ao acessar dashboard" -ForegroundColor Red
}

Write-Host "`n=== VERIFICAÇÃO CONCLUÍDA ===" -ForegroundColor Green 