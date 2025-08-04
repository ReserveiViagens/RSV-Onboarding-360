# Script para corrigir problemas de caracteres especiais
Write-Host "=== CORREÇÃO DE CARACTERES ESPECIAIS ===" -ForegroundColor Green

# Verificar se o servidor está rodando
Write-Host "`n1. Verificando servidor..." -ForegroundColor Yellow
$ports = @(3000, 3001, 3002, 3003)
$serverPort = $null

foreach ($port in $ports) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$port" -Method Head -TimeoutSec 3
        Write-Host "✓ Servidor rodando na porta $port" -ForegroundColor Green
        $serverPort = $port
        break
    } catch {
        Write-Host "✗ Porta $port não acessível" -ForegroundColor Red
    }
}

if (-not $serverPort) {
    Write-Host "✗ Nenhum servidor encontrado" -ForegroundColor Red
    exit 1
}

# Analisar o arquivo dashboard.tsx
Write-Host "`n2. Analisando arquivo dashboard.tsx..." -ForegroundColor Yellow
$dashboardFile = "rsv-onion360/frontend/src/pages/dashboard.tsx"

if (Test-Path $dashboardFile) {
    Write-Host "✓ Arquivo encontrado" -ForegroundColor Green
    
    # Ler o arquivo com diferentes encodings
    $encodings = @("UTF8", "UTF8BOM", "ASCII", "Unicode")
    
    foreach ($encoding in $encodings) {
        Write-Host "`nTestando encoding: $encoding" -ForegroundColor Cyan
        try {
            $content = Get-Content $dashboardFile -Encoding $encoding -Raw
            Write-Host "✓ Encoding $encoding funciona" -ForegroundColor Green
            
            # Verificar caracteres especiais
            $specialChars = $content -match '[^\x00-\x7F]'
            if ($specialChars) {
                Write-Host "⚠️  Caracteres especiais encontrados" -ForegroundColor Yellow
                $specialChars | Select-Object -First 10 | ForEach-Object {
                    Write-Host "  $_" -ForegroundColor Gray
                }
            } else {
                Write-Host "✓ Nenhum caractere especial problemático" -ForegroundColor Green
            }
            
            # Verificar emojis (simplificado)
            $emojiPattern = '[^\x00-\x7F]'
            $emojis = $content -match $emojiPattern
            if ($emojis) {
                Write-Host "✓ Emojis encontrados e válidos" -ForegroundColor Green
            }
            
            break
        } catch {
            Write-Host "✗ Encoding $encoding falhou" -ForegroundColor Red
        }
    }
} else {
    Write-Host "✗ Arquivo não encontrado" -ForegroundColor Red
}

# Verificar se há problemas de sintaxe
Write-Host "`n3. Verificando sintaxe..." -ForegroundColor Yellow
try {
    $content = Get-Content $dashboardFile -Raw -Encoding UTF8
    
    # Verificar tags JSX não fechadas
    $openTags = ($content -split '<')[1..] | Where-Object { $_ -match '^[a-zA-Z]' -and -not ($_ -match '/>$' -or $_ -match '^/') }
    $closeTags = ($content -split '</')[1..] | Where-Object { $_ -match '^[a-zA-Z]' }
    
    Write-Host "Tags abertas encontradas: $($openTags.Count)" -ForegroundColor Cyan
    Write-Host "Tags fechadas encontradas: $($closeTags.Count)" -ForegroundColor Cyan
    
    if ($openTags.Count -eq $closeTags.Count) {
        Write-Host "✓ Estrutura JSX parece estar correta" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Possível problema na estrutura JSX" -ForegroundColor Yellow
    }
    
    # Verificar chaves não balanceadas
    $openBraces = ($content -split '{').Count - 1
    $closeBraces = ($content -split '}').Count - 1
    
    Write-Host "Chaves abertas: $openBraces" -ForegroundColor Cyan
    Write-Host "Chaves fechadas: $closeBraces" -ForegroundColor Cyan
    
    if ($openBraces -eq $closeBraces) {
        Write-Host "✓ Chaves estão balanceadas" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Chaves não estão balanceadas" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "✗ Erro ao analisar sintaxe" -ForegroundColor Red
}

# Testar acesso ao dashboard
Write-Host "`n4. Testando acesso ao dashboard..." -ForegroundColor Yellow
try {
    $dashboardResponse = Invoke-WebRequest -Uri "http://localhost:$serverPort/dashboard" -Method Head -TimeoutSec 10
    Write-Host "✓ Dashboard acessível" -ForegroundColor Green
} catch {
    Write-Host "✗ Erro ao acessar dashboard" -ForegroundColor Red
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar se há problemas de encoding no arquivo
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
        
        # Tentar corrigir o encoding
        Write-Host "`n6. Tentando corrigir encoding..." -ForegroundColor Yellow
        $utf8Content = [System.Text.Encoding]::UTF8.GetString($bytes)
        $utf8Content | Set-Content $dashboardFile -Encoding UTF8
        Write-Host "✓ Arquivo reescrito com encoding UTF8" -ForegroundColor Green
    } else {
        Write-Host "✓ Encoding parece estar correto" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Erro ao verificar encoding" -ForegroundColor Red
}

Write-Host "`n=== ANÁLISE CONCLUÍDA ===" -ForegroundColor Green
Write-Host "Acesse http://localhost:$serverPort/dashboard para verificar" -ForegroundColor Cyan 