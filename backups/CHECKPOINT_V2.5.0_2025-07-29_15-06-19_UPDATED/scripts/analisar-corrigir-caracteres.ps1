# Script para analisar e corrigir caracteres especiais em todo o sistema
Write-Host "=== ANÁLISE E CORREÇÃO DE CARACTERES ESPECIAIS ===" -ForegroundColor Green

# Função para verificar encoding de arquivo
function Test-FileEncoding {
    param([string]$FilePath)
    
    try {
        $content = Get-Content $FilePath -Raw -Encoding UTF8
        $hasSpecialChars = $content -match '[^\x00-\x7F]'
        return @{
            Path = $FilePath
            HasSpecialChars = $hasSpecialChars
            Content = $content
        }
    } catch {
        return @{
            Path = $FilePath
            HasSpecialChars = $false
            Content = ""
            Error = $_.Exception.Message
        }
    }
}

# Função para corrigir encoding
function Fix-FileEncoding {
    param([string]$FilePath)
    
    try {
        $content = Get-Content $FilePath -Raw -Encoding UTF8
        
        # Salvar com encoding UTF-8
        $content | Out-File -FilePath $FilePath -Encoding UTF8 -NoNewline
        return $true
    } catch {
        Write-Host "Erro ao corrigir $FilePath : $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

Write-Host "`n1. Analisando arquivos principais..." -ForegroundColor Yellow

# Lista de arquivos principais para verificar
$mainFiles = @(
    "rsv-onion360/frontend/src/pages/dashboard.tsx",
    "rsv-onion360/frontend/src/pages/login.tsx",
    "rsv-onion360/frontend/src/pages/_document.tsx",
    "rsv-onion360/frontend/src/pages/_app.tsx",
    "rsv-onion360/frontend/src/pages/gestao.tsx",
    "rsv-onion360/frontend/src/pages/automacao.tsx",
    "rsv-onion360/frontend/src/pages/vouchers.tsx",
    "rsv-onion360/frontend/src/pages/voucher-editor.tsx"
)

$filesWithIssues = @()

foreach ($file in $mainFiles) {
    if (Test-Path $file) {
        Write-Host "Verificando: $file" -ForegroundColor Cyan
        $result = Test-FileEncoding -FilePath $file
        
        if ($result.HasSpecialChars) {
            Write-Host "  ✗ Problemas encontrados" -ForegroundColor Red
            $filesWithIssues += $result
        } else {
            Write-Host "  ✓ OK" -ForegroundColor Green
        }
    } else {
        Write-Host "  ⚠ Arquivo não encontrado: $file" -ForegroundColor Yellow
    }
}

Write-Host "`n2. Verificando arquivos de configuração..." -ForegroundColor Yellow

$configFiles = @(
    "rsv-onion360/frontend/next.config.js",
    "rsv-onion360/frontend/package.json",
    "rsv-onion360/frontend/tsconfig.json"
)

foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "Verificando: $file" -ForegroundColor Cyan
        $result = Test-FileEncoding -FilePath $file
        
        if ($result.HasSpecialChars) {
            Write-Host "  ✗ Problemas encontrados" -ForegroundColor Red
            $filesWithIssues += $result
        } else {
            Write-Host "  ✓ OK" -ForegroundColor Green
        }
    }
}

Write-Host "`n3. Verificando arquivos de documentação..." -ForegroundColor Yellow

$docFiles = Get-ChildItem -Path "rsv-onion360" -Filter "*.md" -Recurse | Select-Object -First 10

foreach ($file in $docFiles) {
    Write-Host "Verificando: $($file.FullName)" -ForegroundColor Cyan
    $result = Test-FileEncoding -FilePath $file.FullName
    
    if ($result.HasSpecialChars) {
        Write-Host "  ✗ Problemas encontrados" -ForegroundColor Red
        $filesWithIssues += $result
    } else {
        Write-Host "  ✓ OK" -ForegroundColor Green
    }
}

# Corrigir arquivos com problemas
if ($filesWithIssues.Count -gt 0) {
    Write-Host "`n4. Corrigindo arquivos com problemas..." -ForegroundColor Yellow
    
    foreach ($file in $filesWithIssues) {
        Write-Host "Corrigindo: $($file.Path)" -ForegroundColor Cyan
        $success = Fix-FileEncoding -FilePath $file.Path
        
        if ($success) {
            Write-Host "  ✓ Corrigido" -ForegroundColor Green
        } else {
            Write-Host "  ✗ Erro na correção" -ForegroundColor Red
        }
    }
} else {
    Write-Host "`n4. Nenhum problema encontrado!" -ForegroundColor Green
}

Write-Host "`n5. Verificando servidor..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method Head -TimeoutSec 5
    Write-Host "✓ Servidor rodando" -ForegroundColor Green
} catch {
    Write-Host "✗ Servidor não acessível" -ForegroundColor Red
}

Write-Host "`n=== ANÁLISE CONCLUÍDA ===" -ForegroundColor Green
Write-Host "Arquivos verificados: $($mainFiles.Count + $configFiles.Count + $docFiles.Count)" -ForegroundColor White
Write-Host "Problemas encontrados: $($filesWithIssues.Count)" -ForegroundColor White

if ($filesWithIssues.Count -gt 0) {
    Write-Host "Todos os problemas foram corrigidos!" -ForegroundColor Green
} else {
    Write-Host "Nenhum problema de caracteres encontrado!" -ForegroundColor Green
} 