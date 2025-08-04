# Script para Iniciar o Servidor Next.js
# Versão: 1.0
# Data: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

Write-Host "=== INICIANDO SERVIDOR NEXT.JS ===" -ForegroundColor Cyan
Write-Host ""

# Parar processos Node.js existentes
Write-Host "1. Parando processos Node.js existentes..." -ForegroundColor Yellow
try {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "   ✅ Processos Node.js parados" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Nenhum processo Node.js encontrado" -ForegroundColor Yellow
}

# Aguardar um pouco
Start-Sleep -Seconds 3

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

# Instalar dependências
Write-Host ""
Write-Host "4. Instalando dependências..." -ForegroundColor Yellow
npm install --legacy-peer-deps
Write-Host "   ✅ Dependências instaladas" -ForegroundColor Green

# Iniciar servidor
Write-Host ""
Write-Host "5. Iniciando servidor de desenvolvimento..." -ForegroundColor Yellow
Write-Host "   🚀 Executando: npm run dev" -ForegroundColor Cyan

# Iniciar o servidor em background
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Minimized

# Aguardar inicialização
Write-Host ""
Write-Host "6. Aguardando inicialização do servidor..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Verificar se o servidor está rodando
Write-Host ""
Write-Host "7. Verificando status do servidor..." -ForegroundColor Yellow

$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    Write-Host "   ✅ Servidor rodando na porta 3000" -ForegroundColor Green
    Write-Host "   🌐 URL: http://localhost:3000" -ForegroundColor Cyan
} else {
    Write-Host "   ❌ Servidor não está rodando na porta 3000" -ForegroundColor Red
    Write-Host "   🔍 Verificando processos..." -ForegroundColor Yellow
    
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        Write-Host "   ✅ Processos Node.js encontrados: $($nodeProcesses.Count)" -ForegroundColor Green
        foreach ($process in $nodeProcesses) {
            Write-Host "      - PID: $($process.Id), CPU: $($process.CPU)" -ForegroundColor White
        }
    } else {
        Write-Host "   ❌ Nenhum processo Node.js encontrado" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== RESULTADO ===" -ForegroundColor Cyan
if ($port3000) {
    Write-Host "✅ SERVIDOR INICIADO COM SUCESSO" -ForegroundColor Green
    Write-Host "🌐 Acesse: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "🔐 Permissões: http://localhost:3000/permissions" -ForegroundColor Cyan
} else {
    Write-Host "❌ FALHA AO INICIAR SERVIDOR" -ForegroundColor Red
    Write-Host "🔧 Verifique os logs acima" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Pressione qualquer tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 