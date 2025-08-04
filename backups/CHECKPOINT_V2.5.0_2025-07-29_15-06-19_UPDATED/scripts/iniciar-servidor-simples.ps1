# Script Simples para Iniciar o Servidor
Write-Host "=== INICIANDO SERVIDOR ===" -ForegroundColor Cyan

# Navegar para o diretório
Set-Location "rsv-onion360/frontend"
Write-Host "Diretório: $(Get-Location)" -ForegroundColor Green

# Limpar cache
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "Cache limpo" -ForegroundColor Green
}

# Iniciar servidor
Write-Host "Iniciando servidor..." -ForegroundColor Yellow
npm run dev 