# Script para testar a reorganização das seções do dashboard
Write-Host "=== TESTE DE REORGANIZAÇÃO DO DASHBOARD ===" -ForegroundColor Green

# Verificar se o servidor está rodando
Write-Host "`n1. Verificando se o servidor está rodando..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002" -Method Head -TimeoutSec 5
    Write-Host "✓ Servidor está rodando na porta 3002" -ForegroundColor Green
} catch {
    Write-Host "✗ Servidor não está acessível na porta 3002" -ForegroundColor Red
    Write-Host "Tentando porta 3001..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001" -Method Head -TimeoutSec 5
        Write-Host "✓ Servidor está rodando na porta 3001" -ForegroundColor Green
        $port = 3001
    } catch {
        Write-Host "✗ Servidor não está acessível" -ForegroundColor Red
        exit 1
    }
}

# Testar acesso ao dashboard
Write-Host "`n2. Testando acesso ao dashboard..." -ForegroundColor Yellow
try {
    $dashboardResponse = Invoke-WebRequest -Uri "http://localhost:3002/dashboard" -Method Head -TimeoutSec 10
    Write-Host "✓ Dashboard acessível" -ForegroundColor Green
} catch {
    Write-Host "✗ Erro ao acessar dashboard" -ForegroundColor Red
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar se o arquivo dashboard.tsx existe e tem o conteúdo correto
Write-Host "`n3. Verificando arquivo dashboard.tsx..." -ForegroundColor Yellow
$dashboardFile = "rsv-onion360/frontend/src/pages/dashboard.tsx"
if (Test-Path $dashboardFile) {
    Write-Host "✓ Arquivo dashboard.tsx existe" -ForegroundColor Green
    
    # Verificar se as seções estão na ordem correta
    $content = Get-Content $dashboardFile -Raw
    
    # Verificar ordem das seções
    $acoesRapidas = $content -match "🚀 Ações Rápidas"
    $todasFuncionalidades = $content -match "🎯 Todas as Funcionalidades"
    $statusServicos = $content -match "Status dos Serviços"
    $sobreEmpresa = $content -match "Sobre a Reservei Viagens"
    
    if ($acoesRapidas -and $todasFuncionalidades -and $statusServicos -and $sobreEmpresa) {
        Write-Host "✓ Todas as seções estão presentes" -ForegroundColor Green
        
        # Verificar ordem (posições relativas)
        $acoesIndex = $content.IndexOf("🚀 Ações Rápidas")
        $todasIndex = $content.IndexOf("🎯 Todas as Funcionalidades")
        $statusIndex = $content.IndexOf("Status dos Serviços")
        $sobreIndex = $content.IndexOf("Sobre a Reservei Viagens")
        
        if ($acoesIndex -lt $todasIndex -and $todasIndex -lt $statusIndex -and $statusIndex -lt $sobreIndex) {
            Write-Host "✓ Ordem das seções está correta:" -ForegroundColor Green
            Write-Host "  1. 🚀 Ações Rápidas" -ForegroundColor Cyan
            Write-Host "  2. 🎯 Todas as Funcionalidades" -ForegroundColor Cyan
            Write-Host "  3. Status dos Serviços" -ForegroundColor Cyan
            Write-Host "  4. Sobre a Reservei Viagens" -ForegroundColor Cyan
        } else {
            Write-Host "✗ Ordem das seções está incorreta" -ForegroundColor Red
        }
    } else {
        Write-Host "✗ Algumas seções estão faltando" -ForegroundColor Red
    }
} else {
    Write-Host "✗ Arquivo dashboard.tsx não encontrado" -ForegroundColor Red
}

# Verificar caracteres especiais
Write-Host "`n4. Verificando caracteres especiais..." -ForegroundColor Yellow
$content = Get-Content $dashboardFile -Raw -Encoding UTF8

# Verificar emojis e caracteres especiais
$emojis = @("🚀", "🎯", "🏖️", "📢", "🎁", "🛒", "💼", "📝", "🤖", "🎫", "👔", "📄", "✈️", "📈", "📊", "🔍", "💡", "⭐", "🏆", "🎫", "🎁", "💰", "📦", "📋", "🛍️", "📈", "💳", "↩️", "📸", "🎥", "⭐", "🌐", "💬", "🔔", "⚙️", "🔄", "✏️", "📋", "✅", "🔐", "⚙️", "🛡️", "🛂", "🏨", "🚗", "🗺️", "📦", "📋", "💳", "⬆️")

$emojisEncontrados = @()
foreach ($emoji in $emojis) {
    if ($content -match [regex]::Escape($emoji)) {
        $emojisEncontrados += $emoji
    }
}

if ($emojisEncontrados.Count -gt 0) {
    Write-Host "✓ Emojis encontrados no arquivo:" -ForegroundColor Green
    $emojisEncontrados | ForEach-Object { Write-Host "  $_" -ForegroundColor Cyan }
} else {
    Write-Host "✗ Nenhum emoji encontrado" -ForegroundColor Red
}

# Verificar encoding do arquivo
Write-Host "`n5. Verificando encoding do arquivo..." -ForegroundColor Yellow
try {
    $bytes = [System.IO.File]::ReadAllBytes($dashboardFile)
    $encoding = [System.Text.Encoding]::UTF8
    $content = $encoding.GetString($bytes)
    
    # Verificar se há caracteres corrompidos
    $corruptedChars = $content -match '[^\x00-\x7F]'
    if ($corruptedChars) {
        Write-Host "⚠️  Caracteres especiais detectados" -ForegroundColor Yellow
        Write-Host "Isso pode indicar problemas de encoding" -ForegroundColor Yellow
    } else {
        Write-Host "✓ Encoding parece estar correto" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Erro ao verificar encoding" -ForegroundColor Red
}

Write-Host "`n=== TESTE CONCLUÍDO ===" -ForegroundColor Green
Write-Host "Acesse http://localhost:3002/dashboard para verificar visualmente" -ForegroundColor Cyan 