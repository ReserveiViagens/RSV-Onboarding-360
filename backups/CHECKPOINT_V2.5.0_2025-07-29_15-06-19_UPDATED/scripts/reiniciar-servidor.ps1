# Script para Reiniciar o Servidor Completamente
Write-Host "=== REINICIANDO SERVIDOR ===" -ForegroundColor Cyan

# Parar todos os processos Node.js
Write-Host "1. Parando processos Node.js..." -ForegroundColor Yellow
try {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "   ✅ Processos Node.js parados" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Erro ao parar processos: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Aguardar um pouco
Start-Sleep -Seconds 5

# Navegar para o diretório do frontend
Write-Host ""
Write-Host "2. Navegando para o diretório do frontend..." -ForegroundColor Yellow
Set-Location "rsv-onion360/frontend"
Write-Host "   ✅ Diretório: $(Get-Location)" -ForegroundColor Green

# Limpar cache do Next.js
Write-Host ""
Write-Host "3. Limpando cache do Next.js..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "   ✅ Cache limpo" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Cache não encontrado" -ForegroundColor Yellow
}

# Limpar node_modules se necessário
Write-Host ""
Write-Host "4. Verificando node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   ✅ node_modules encontrado" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  node_modules não encontrado, instalando..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
}

# Iniciar servidor
Write-Host ""
Write-Host "5. Iniciando servidor de desenvolvimento..." -ForegroundColor Yellow
Write-Host "   🚀 Executando: npm run dev" -ForegroundColor Cyan

# Iniciar o servidor
npm run dev 