# Script para verificar e iniciar o servidor Next.js
# Autor: Sistema Onion RSV 360
# Data: 28/07/2025

Write-Host "VERIFICANDO E INICIANDO SERVIDOR..." -ForegroundColor Green

# Função para verificar se a porta está em uso
function Test-Port {
    param([int]$Port)
    
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $connection -ne $null
}

# Função para testar se o servidor está respondendo
function Test-Server {
    param([string]$Url)
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -TimeoutSec 5
        return $response.StatusCode -eq 200
    }
    catch {
        return $false
    }
}

Write-Host "Verificando porta 3000..." -ForegroundColor Yellow

# Verificar se a porta 3000 está em uso
if (Test-Port -Port 3000) {
    Write-Host "Porta 3000 está em uso" -ForegroundColor Green
    
    # Testar se o servidor está respondendo
    if (Test-Server -Url "http://localhost:3000") {
        Write-Host "Servidor está funcionando corretamente!" -ForegroundColor Green
        Write-Host "URL: http://localhost:3000" -ForegroundColor Cyan
        Write-Host "Status: ✅ ONLINE" -ForegroundColor Green
        return
    } else {
        Write-Host "Porta em uso mas servidor não responde" -ForegroundColor Yellow
    }
} else {
    Write-Host "Porta 3000 não está em uso" -ForegroundColor Yellow
}

# Parar processos Node.js se necessário
Write-Host "Parando processos Node.js..." -ForegroundColor Yellow
taskkill /f /im node.exe 2>$null

# Aguardar um pouco
Start-Sleep -Seconds 2

# Navegar para o diretório do frontend
Set-Location "rsv-onion360/frontend"

# Verificar se o diretório existe
if (-not (Test-Path "package.json")) {
    Write-Host "ERRO: package.json não encontrado!" -ForegroundColor Red
    Write-Host "Verifique se está no diretório correto" -ForegroundColor Red
    return
}

# Limpar cache se necessário
if (Test-Path ".next") {
    Write-Host "Limpando cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
}

# Iniciar servidor
Write-Host "Iniciando servidor de desenvolvimento..." -ForegroundColor Green
Write-Host "URL: http://localhost:3000" -ForegroundColor Cyan

# Iniciar em background
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory (Get-Location) -WindowStyle Hidden

# Aguardar inicialização
Write-Host "Aguardando inicialização..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar se o servidor está funcionando
$maxAttempts = 10
$attempt = 0

while ($attempt -lt $maxAttempts) {
    $attempt++
    Write-Host "Tentativa $attempt/$maxAttempts..." -ForegroundColor Yellow
    
    if (Test-Server -Url "http://localhost:3000") {
        Write-Host "✅ SERVIDOR INICIADO COM SUCESSO!" -ForegroundColor Green
        Write-Host "URL: http://localhost:3000" -ForegroundColor Cyan
        Write-Host "Status: ONLINE" -ForegroundColor Green
        break
    } else {
        Write-Host "Aguardando..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3
    }
}

if ($attempt -eq $maxAttempts) {
    Write-Host "❌ ERRO: Servidor não iniciou corretamente" -ForegroundColor Red
    Write-Host "Verifique os logs para mais detalhes" -ForegroundColor Red
} else {
    Write-Host "🎉 Servidor pronto para uso!" -ForegroundColor Green
} 