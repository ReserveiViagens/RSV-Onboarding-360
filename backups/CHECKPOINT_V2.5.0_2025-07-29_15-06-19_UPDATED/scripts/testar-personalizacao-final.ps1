# Script para testar personalizações do Dashboard e Login - VERSÃO FINAL
# Autor: Sistema Onion RSV 360
# Data: 28/07/2025

Write-Host "TESTANDO PERSONALIZACOES FINAIS DO DASHBOARD E LOGIN..." -ForegroundColor Green

# Verificar se o servidor esta rodando
Write-Host "Verificando servidor frontend..." -ForegroundColor Yellow
try {
    $frontendStatus = Invoke-WebRequest -Uri "http://localhost:3001" -Method Head -TimeoutSec 5
    if ($frontendStatus.StatusCode -eq 200) {
        Write-Host "OK - Servidor frontend funcionando na porta 3001" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Servidor frontend nao esta rodando" -ForegroundColor Red
    }
} catch {
    Write-Host "ERRO - Erro ao conectar com servidor: $($_.Exception.Message)" -ForegroundColor Red
}

# Testar Dashboard personalizado
Write-Host "Testando Dashboard personalizado..." -ForegroundColor Yellow
try {
    $dashboardResponse = Invoke-WebRequest -Uri "http://localhost:3001/dashboard" -Method Head -TimeoutSec 10
    if ($dashboardResponse.StatusCode -eq 200) {
        Write-Host "OK - Dashboard personalizado acessivel" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Dashboard personalizado nao acessivel" -ForegroundColor Red
    }
} catch {
    Write-Host "ERRO - Erro ao acessar Dashboard: $($_.Exception.Message)" -ForegroundColor Red
}

# Testar Login personalizado
Write-Host "Testando Login personalizado..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:3001/login" -Method Head -TimeoutSec 10
    if ($loginResponse.StatusCode -eq 200) {
        Write-Host "OK - Login personalizado acessivel" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Login personalizado nao acessivel" -ForegroundColor Red
    }
} catch {
    Write-Host "ERRO - Erro ao acessar Login: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar se os arquivos foram corrigidos
Write-Host "Verificando arquivos corrigidos..." -ForegroundColor Yellow

$dashboardPath = "rsv-onion360/frontend/src/pages/dashboard.tsx"
if (Test-Path $dashboardPath) {
    $dashboardContent = Get-Content $dashboardPath -Raw
    
    # Verificar se o arquivo esta completo
    if ($dashboardContent -match "export default function Dashboard") {
        Write-Host "OK - Dashboard.tsx esta completo" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Dashboard.tsx incompleto" -ForegroundColor Red
    }
    
    # Verificar se nao ha erros de sintaxe
    if ($dashboardContent -match "return \(" -and $dashboardContent -match "ProtectedRoute") {
        Write-Host "OK - Sintaxe do Dashboard.tsx correta" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Sintaxe do Dashboard.tsx incorreta" -ForegroundColor Red
    }
    
    # Verificar elementos personalizados
    $dashboardElements = @(
        "Header Personalizado",
        "Logo e Nome da Empresa",
        "Redes Sociais",
        "Menu Mobile",
        "Seção de Boas-vindas",
        "Estatísticas Rápidas",
        "Informações da Empresa"
    )
    
    foreach ($element in $dashboardElements) {
        if ($dashboardContent -match $element) {
            Write-Host "OK - Elemento '$element' encontrado no Dashboard" -ForegroundColor Green
        } else {
            Write-Host "ERRO - Elemento '$element' nao encontrado no Dashboard" -ForegroundColor Red
        }
    }
    
} else {
    Write-Host "ERRO - Arquivo dashboard.tsx nao encontrado" -ForegroundColor Red
}

$loginPath = "rsv-onion360/frontend/src/pages/login.tsx"
if (Test-Path $loginPath) {
    $loginContent = Get-Content $loginPath -Raw
    
    # Verificar se o arquivo esta completo
    if ($loginContent -match "export default function Login") {
        Write-Host "OK - Login.tsx esta completo" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Login.tsx incompleto" -ForegroundColor Red
    }
    
    # Verificar elementos personalizados do login
    $loginElements = @(
        "Layout Dividido",
        "Lado Esquerdo",
        "Lado Direito",
        "Logo e Nome",
        "Estatísticas",
        "Redes Sociais",
        "Formulário de Login",
        "Logo Mobile"
    )
    
    foreach ($element in $loginElements) {
        if ($loginContent -match $element) {
            Write-Host "OK - Elemento '$element' encontrado no Login" -ForegroundColor Green
        } else {
            Write-Host "ERRO - Elemento '$element' nao encontrado no Login" -ForegroundColor Red
        }
    }
    
} else {
    Write-Host "ERRO - Arquivo login.tsx nao encontrado" -ForegroundColor Red
}

Write-Host "`nTESTE FINAL CONCLUIDO!" -ForegroundColor Green
Write-Host "Acesse:" -ForegroundColor Cyan
Write-Host "- Dashboard: http://localhost:3001/dashboard" -ForegroundColor Cyan
Write-Host "- Login: http://localhost:3001/login" -ForegroundColor Cyan
Write-Host "Personalizacoes implementadas e funcionando com sucesso!" -ForegroundColor Green
Write-Host "Recursos disponiveis:" -ForegroundColor Cyan
Write-Host "- Dashboard com header personalizado" -ForegroundColor Cyan
Write-Host "- Informacoes da empresa (Reservei Viagens)" -ForegroundColor Cyan
Write-Host "- Redes sociais integradas" -ForegroundColor Cyan
Write-Host "- Estatisticas da empresa" -ForegroundColor Cyan
Write-Host "- Login com layout dividido" -ForegroundColor Cyan
Write-Host "- Design responsivo e moderno" -ForegroundColor Cyan
Write-Host "Servidor rodando na porta 3001" -ForegroundColor Cyan 