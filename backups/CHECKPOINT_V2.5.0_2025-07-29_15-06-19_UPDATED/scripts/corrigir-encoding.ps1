# Script para corrigir problemas de encoding UTF-8
# Autor: Sistema Onion RSV 360
# Data: 28/07/2025

Write-Host "CORRIGINDO PROBLEMAS DE ENCODING UTF-8..." -ForegroundColor Green

# Lista de caracteres problemáticos e suas correções
$correcoes = @{
    "Ã£" = "ã"
    "Ã§" = "ç"
    "Ã¡" = "á"
    "Ã©" = "é"
    "Ã­" = "í"
    "Ã³" = "ó"
    "Ãº" = "ú"
    "Ã " = "à"
    "Ã¨" = "è"
    "Ã¬" = "ì"
    "Ã²" = "ò"
    "Ã¹" = "ù"
    "Ã¢" = "â"
    "Ãª" = "ê"
    "Ã®" = "î"
    "Ã´" = "ô"
    "Ã»" = "û"
    "Ã¤" = "ä"
    "Ã«" = "ë"
    "Ã¯" = "ï"
    "Ã¶" = "ö"
    "Ã¼" = "ü"
    "Ã±" = "ñ"
}

$frontendPath = "frontend/src/pages"

Write-Host "Verificando arquivos em: $frontendPath" -ForegroundColor Yellow

# Lista de arquivos para verificar
$arquivos = @(
    "dashboard.tsx",
    "automacao.tsx",
    "gestao.tsx",
    "conteudo.tsx",
    "e-commerce.tsx",
    "loyalty.tsx"
)

foreach ($arquivo in $arquivos) {
    $filePath = "$frontendPath/$arquivo"
    
    if (Test-Path $filePath) {
        Write-Host "Processando: $arquivo" -ForegroundColor Green
        
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        $modificado = $false
        foreach ($problema in $correcoes.Keys) {
            if ($content -match $problema) {
                $content = $content -replace $problema, $correcoes[$problema]
                $modificado = $true
                Write-Host "  Corrigido: $problema -> $($correcoes[$problema])" -ForegroundColor Blue
            }
        }
        
        if ($modificado) {
            Set-Content $filePath $content -Encoding UTF8
            Write-Host "  Arquivo atualizado: $arquivo" -ForegroundColor Green
        } else {
            Write-Host "  Nenhuma correcao necessaria: $arquivo" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Arquivo nao encontrado: $arquivo" -ForegroundColor Red
    }
}

Write-Host "PROCESSO CONCLUIDO!" -ForegroundColor Green
Write-Host "Problemas de encoding corrigidos" -ForegroundColor Green 