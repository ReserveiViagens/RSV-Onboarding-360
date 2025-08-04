# Script para Testar a Página de Usuários
Write-Host "=== TESTANDO PÁGINA DE USUÁRIOS ===" -ForegroundColor Cyan

# Verificar se o servidor está rodando
Write-Host "1. Verificando se o servidor está rodando..." -ForegroundColor Yellow
$serverRunning = netstat -an | findstr ":3000" | findstr "LISTENING"
if ($serverRunning) {
    Write-Host "   ✅ Servidor rodando na porta 3000" -ForegroundColor Green
} else {
    Write-Host "   ❌ Servidor não está rodando" -ForegroundColor Red
    exit 1
}

# Testar acesso à página
Write-Host ""
Write-Host "2. Testando acesso à página de usuários..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/users" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Página de usuários acessível (Status: $($response.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Página retornou status: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Erro ao acessar página: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar processos Node.js
Write-Host ""
Write-Host "3. Verificando processos Node.js..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "   ✅ $($nodeProcesses.Count) processo(s) Node.js ativo(s)" -ForegroundColor Green
    foreach ($process in $nodeProcesses) {
        Write-Host "      - PID: $($process.Id), CPU: $($process.CPU), Memória: $([math]::Round($process.WorkingSet / 1MB, 2)) MB" -ForegroundColor Gray
    }
} else {
    Write-Host "   ❌ Nenhum processo Node.js encontrado" -ForegroundColor Red
}

# Verificar arquivos importantes
Write-Host ""
Write-Host "4. Verificando arquivos importantes..." -ForegroundColor Yellow
$filesToCheck = @(
    "src/pages/users.tsx",
    "src/components/NavigationButtons.tsx",
    "next.config.js",
    "package.json"
)

foreach ($file in $filesToCheck) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file (não encontrado)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== TESTE CONCLUÍDO ===" -ForegroundColor Cyan
Write-Host "Acesse: http://localhost:3000/users" -ForegroundColor Green 