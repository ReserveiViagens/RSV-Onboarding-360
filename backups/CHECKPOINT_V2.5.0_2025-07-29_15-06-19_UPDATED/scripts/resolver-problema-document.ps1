# Script para Resolver Problema do _document.js
Write-Host "=== RESOLVENDO PROBLEMA DO _DOCUMENT.JS ===" -ForegroundColor Cyan

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

# Limpar cache completamente
Write-Host ""
Write-Host "3. Limpando cache completamente..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "   ✅ Cache .next removido" -ForegroundColor Green
}

if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "   ✅ node_modules removido" -ForegroundColor Green
}

# Remover arquivos problemáticos
Write-Host ""
Write-Host "4. Removendo arquivos problemáticos..." -ForegroundColor Yellow
$problemFiles = @(
    "src/pages/automação.tsx",
    "src/pages/gestão.tsx", 
    "src/pages/conte%C3%BAdo.tsx",
    "src/pages/conteúdo.tsx",
    "src/pages/fidelização.tsx"
)

foreach ($file in $problemFiles) {
    if (Test-Path $file) {
        Remove-Item -Force $file
        Write-Host "   ✅ $file removido" -ForegroundColor Green
    }
}

# Reinstalar dependências
Write-Host ""
Write-Host "5. Reinstalando dependências..." -ForegroundColor Yellow
npm install --legacy-peer-deps
Write-Host "   ✅ Dependências instaladas" -ForegroundColor Green

# Iniciar servidor
Write-Host ""
Write-Host "6. Iniciando servidor..." -ForegroundColor Yellow
Write-Host "   🚀 Executando: npm run dev" -ForegroundColor Cyan

# Iniciar o servidor
npm run dev 