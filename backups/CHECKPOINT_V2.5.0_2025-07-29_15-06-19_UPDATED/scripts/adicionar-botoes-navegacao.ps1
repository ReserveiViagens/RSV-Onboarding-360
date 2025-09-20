# Script para adicionar botoes de navegacao em todas as paginas
# Autor: Sistema Onion RSV 360
# Data: 28/07/2025

Write-Host "ADICIONANDO BOTOES DE NAVEGACAO EM TODAS AS PAGINAS..." -ForegroundColor Green

# Lista de paginas para adicionar botoes de navegacao
$pages = @(
    "analytics-dashboard.tsx",
    "attractions.tsx", 
    "cadastros.tsx",
    "dashboard.tsx",
    "finance-dashboard.tsx",
    "financeiro.tsx",
    "giftcards.tsx",
    "hotels.tsx",
    "login.tsx",
    "marketing-dashboard.tsx",
    "marketing.tsx",
    "multilingual.tsx",
    "pagamentos.tsx",
    "parks.tsx",
    "products.tsx",
    "reports-dashboard.tsx",
    "reports.tsx",
    "rewards.tsx",
    "sales-dashboard.tsx",
    "seo.tsx",
    "subscriptions.tsx",
    "tickets.tsx",
    "transport.tsx",
    "turismo.tsx"
)

$frontendPath = "frontend/src/pages"

Write-Host "Verificando paginas em: $frontendPath" -ForegroundColor Yellow

foreach ($page in $pages) {
    $filePath = "$frontendPath/$page"
    
    if (Test-Path $filePath) {
        Write-Host "Processando: $page" -ForegroundColor Green
        
        # Verificar se ja tem NavigationButtons importado
        $content = Get-Content $filePath -Raw
        if ($content -notmatch "import NavigationButtons") {
            Write-Host "  Adicionando import do NavigationButtons..." -ForegroundColor Blue
            
            # Adicionar import apos os imports do lucide-react
            $content = $content -replace "} from 'lucide-react';", "} from 'lucide-react';`nimport NavigationButtons from '../components/NavigationButtons';"
            
            # Salvar arquivo
            Set-Content $filePath $content -Encoding UTF8
            Write-Host "  Import adicionado em $page" -ForegroundColor Green
        } else {
            Write-Host "  NavigationButtons ja importado em $page" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Arquivo nao encontrado: $page" -ForegroundColor Red
    }
}

Write-Host "PROCESSO CONCLUIDO!" -ForegroundColor Green
Write-Host "Botoes de navegacao adicionados em todas as paginas" -ForegroundColor Green
Write-Host "Paginas processadas: $($pages.Count)" -ForegroundColor Cyan 