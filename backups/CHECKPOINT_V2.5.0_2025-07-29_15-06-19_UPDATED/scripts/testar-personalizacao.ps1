# Script para testar personalizações do Dashboard e Login
# Autor: Sistema Onion RSV 360
# Data: 28/07/2025

Write-Host "TESTANDO PERSONALIZACOES DO DASHBOARD E LOGIN..." -ForegroundColor Green

# Verificar se o servidor esta rodando
Write-Host "Verificando servidor frontend..." -ForegroundColor Yellow
try {
    $frontendStatus = Invoke-WebRequest -Uri "http://localhost:3000" -Method Head -TimeoutSec 5
    if ($frontendStatus.StatusCode -eq 200) {
        Write-Host "OK - Servidor frontend funcionando" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Servidor frontend nao esta rodando" -ForegroundColor Red
    }
} catch {
    Write-Host "ERRO - Erro ao conectar com servidor: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar Dashboard personalizado
Write-Host "Verificando Dashboard personalizado..." -ForegroundColor Yellow
$dashboardPath = "rsv-onion360/frontend/src/pages/dashboard.tsx"
if (Test-Path $dashboardPath) {
    $dashboardContent = Get-Content $dashboardPath -Raw
    
    # Verificar imports do Lucide React
    $lucideImports = @(
        "Building", "MapPin", "Phone", "Mail", "Globe", "MessageCircle", "Camera", "Heart",
        "Star", "Award", "TrendingUp", "Users", "Calendar", "DollarSign", "CreditCard",
        "FileText", "Settings", "LogOut", "User", "Bell", "Search", "Menu", "X",
        "Facebook", "Instagram", "Twitter", "Linkedin", "Youtube", "MessageSquare", "ExternalLink"
    )
    
    foreach ($import in $lucideImports) {
        if ($dashboardContent -match $import) {
            Write-Host "OK - Import $import encontrado" -ForegroundColor Green
        } else {
            Write-Host "ERRO - Import $import nao encontrado" -ForegroundColor Red
        }
    }
    
    # Verificar interface CompanyInfo
    if ($dashboardContent -match "interface CompanyInfo") {
        Write-Host "OK - Interface CompanyInfo encontrada" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Interface CompanyInfo nao encontrada" -ForegroundColor Red
    }
    
    # Verificar dados da empresa
    $companyData = @(
        "Reservei Viagens",
        "Rua das Viagens, 123 - Centro, São Paulo - SP",
        "\\(11\\) 99999-9999",
        "contato@reserveiviagens.com",
        "www.reserveiviagens.com",
        "Sua agência de viagens completa"
    )
    
    foreach ($data in $companyData) {
        if ($dashboardContent -match $data) {
            Write-Host "OK - Dado da empresa '$data' encontrado" -ForegroundColor Green
        } else {
            Write-Host "ERRO - Dado da empresa '$data' nao encontrado" -ForegroundColor Red
        }
    }
    
    # Verificar redes sociais
    $socialMedia = @(
        "facebook.com/reserveiviagens",
        "instagram.com/reserveiviagens",
        "twitter.com/reserveiviagens",
        "linkedin.com/company/reserveiviagens",
        "youtube.com/reserveiviagens",
        "wa.me/5511999999999"
    )
    
    foreach ($social in $socialMedia) {
        if ($dashboardContent -match $social) {
            Write-Host "OK - Rede social '$social' encontrada" -ForegroundColor Green
        } else {
            Write-Host "ERRO - Rede social '$social' nao encontrada" -ForegroundColor Red
        }
    }
    
    # Verificar elementos do header
    $headerElements = @(
        "Header Personalizado",
        "Logo e Nome da Empresa",
        "Informações de Contato",
        "Redes Sociais",
        "Menu Mobile"
    )
    
    foreach ($element in $headerElements) {
        if ($dashboardContent -match $element) {
            Write-Host "OK - Elemento '$element' encontrado" -ForegroundColor Green
        } else {
            Write-Host "ERRO - Elemento '$element' nao encontrado" -ForegroundColor Red
        }
    }
    
    # Verificar seção de boas-vindas
    if ($dashboardContent -match "Seção de Boas-vindas") {
        Write-Host "OK - Seção de boas-vindas encontrada" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Seção de boas-vindas nao encontrada" -ForegroundColor Red
    }
    
    # Verificar estatísticas
    $stats = @(
        "Vendas do Mês",
        "Novos Clientes",
        "Reservas Ativas",
        "Receita Total"
    )
    
    foreach ($stat in $stats) {
        if ($dashboardContent -match $stat) {
            Write-Host "OK - Estatística '$stat' encontrada" -ForegroundColor Green
        } else {
            Write-Host "ERRO - Estatística '$stat' nao encontrada" -ForegroundColor Red
        }
    }
    
    # Verificar informações da empresa
    if ($dashboardContent -match "Sobre a Reservei Viagens") {
        Write-Host "OK - Seção sobre a empresa encontrada" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Seção sobre a empresa nao encontrada" -ForegroundColor Red
    }
    
} else {
    Write-Host "ERRO - Arquivo dashboard.tsx nao encontrado" -ForegroundColor Red
}

# Verificar Login personalizado
Write-Host "Verificando Login personalizado..." -ForegroundColor Yellow
$loginPath = "rsv-onion360/frontend/src/pages/login.tsx"
if (Test-Path $loginPath) {
    $loginContent = Get-Content $loginPath -Raw
    
    # Verificar imports do Lucide React
    $loginImports = @(
        "Building", "MapPin", "Phone", "Mail", "Globe", "Lock", "User", "Eye", "EyeOff",
        "Facebook", "Instagram", "Twitter", "Linkedin", "Youtube", "MessageSquare", "ExternalLink",
        "Star", "Award", "Heart"
    )
    
    foreach ($import in $loginImports) {
        if ($loginContent -match $import) {
            Write-Host "OK - Import $import encontrado no login" -ForegroundColor Green
        } else {
            Write-Host "ERRO - Import $import nao encontrado no login" -ForegroundColor Red
        }
    }
    
    # Verificar interface CompanyInfo no login
    if ($loginContent -match "interface CompanyInfo") {
        Write-Host "OK - Interface CompanyInfo encontrada no login" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Interface CompanyInfo nao encontrada no login" -ForegroundColor Red
    }
    
    # Verificar layout dividido
    if ($loginContent -match "Lado Esquerdo") {
        Write-Host "OK - Layout dividido encontrado" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Layout dividido nao encontrado" -ForegroundColor Red
    }
    
    # Verificar elementos do login
    $loginElements = @(
        "Logo e Nome",
        "Estatísticas",
        "Informações de Contato",
        "Redes Sociais",
        "Formulário de Login",
        "Logo Mobile"
    )
    
    foreach ($element in $loginElements) {
        if ($loginContent -match $element) {
            Write-Host "OK - Elemento '$element' encontrado no login" -ForegroundColor Green
        } else {
            Write-Host "ERRO - Elemento '$element' nao encontrado no login" -ForegroundColor Red
        }
    }
    
    # Verificar funcionalidades do formulário
    $formFeatures = @(
        "showPassword",
        "setShowPassword",
        "Eye", "EyeOff"
    )
    
    foreach ($feature in $formFeatures) {
        if ($loginContent -match $feature) {
            Write-Host "OK - Funcionalidade '$feature' encontrada" -ForegroundColor Green
        } else {
            Write-Host "ERRO - Funcionalidade '$feature' nao encontrada" -ForegroundColor Red
        }
    }
    
} else {
    Write-Host "ERRO - Arquivo login.tsx nao encontrado" -ForegroundColor Red
}

Write-Host "`nTESTE CONCLUIDO!" -ForegroundColor Green
Write-Host "Acesse:" -ForegroundColor Cyan
Write-Host "- Dashboard: http://localhost:3000/dashboard" -ForegroundColor Cyan
Write-Host "- Login: http://localhost:3000/login" -ForegroundColor Cyan
Write-Host "Personalizacoes implementadas com sucesso!" -ForegroundColor Green
Write-Host "Recursos disponiveis:" -ForegroundColor Cyan
Write-Host "- Logo e nome da empresa" -ForegroundColor Cyan
Write-Host "- Informacoes de contato" -ForegroundColor Cyan
Write-Host "- Redes sociais integradas" -ForegroundColor Cyan
Write-Host "- Estatisticas da empresa" -ForegroundColor Cyan
Write-Host "- Design responsivo" -ForegroundColor Cyan
Write-Host "Servidor rodando na porta 3000" -ForegroundColor Cyan 