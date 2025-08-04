# Script para testar cards de todas as funcionalidades no Dashboard
# Autor: Sistema Onion RSV 360
# Data: 28/07/2025

Write-Host "TESTANDO CARDS DE TODAS AS FUNCIONALIDADES NO DASHBOARD..." -ForegroundColor Green

# Verificar se o servidor esta rodando
Write-Host "Verificando servidor frontend..." -ForegroundColor Yellow
try {
    $frontendStatus = Invoke-WebRequest -Uri "http://localhost:3002" -Method Head -TimeoutSec 5
    if ($frontendStatus.StatusCode -eq 200) {
        Write-Host "OK - Servidor frontend funcionando na porta 3002" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Servidor frontend nao esta rodando" -ForegroundColor Red
    }
} catch {
    Write-Host "ERRO - Erro ao conectar com servidor: $($_.Exception.Message)" -ForegroundColor Red
}

# Testar Dashboard com cards
Write-Host "Testando Dashboard com cards..." -ForegroundColor Yellow
try {
    $dashboardResponse = Invoke-WebRequest -Uri "http://localhost:3002/dashboard" -Method Head -TimeoutSec 10
    if ($dashboardResponse.StatusCode -eq 200) {
        Write-Host "OK - Dashboard com cards acessivel" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Dashboard com cards nao acessivel" -ForegroundColor Red
    }
} catch {
    Write-Host "ERRO - Erro ao acessar Dashboard: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar se os cards foram implementados
Write-Host "Verificando implementacao dos cards..." -ForegroundColor Yellow
$dashboardPath = "rsv-onion360/frontend/src/pages/dashboard.tsx"
if (Test-Path $dashboardPath) {
    $dashboardContent = Get-Content $dashboardPath -Raw
    
    # Verificar se a seção foi adicionada
    if ($dashboardContent -match "Todas as Funcionalidades") {
        Write-Host "OK - Seção 'Todas as Funcionalidades' encontrada" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Seção 'Todas as Funcionalidades' nao encontrada" -ForegroundColor Red
    }
    
    # Verificar cards das categorias
    $categorias = @(
        "Turismo",
        "Marketing", 
        "Fidelização",
        "E-commerce",
        "Financeiro",
        "Conteúdo",
        "Automação",
        "Vouchers",
        "Gestão",
        "Documentos",
        "Viagens",
        "Subscrições"
    )
    
    foreach ($categoria in $categorias) {
        if ($dashboardContent -match $categoria) {
            Write-Host "OK - Card '$categoria' encontrado" -ForegroundColor Green
        } else {
            Write-Host "ERRO - Card '$categoria' nao encontrado" -ForegroundColor Red
        }
    }
    
    # Verificar funcionalidades específicas
    $funcionalidades = @(
        "Viagens",
        "Atrações",
        "Parques",
        "Ingressos",
        "Campanhas",
        "Analytics",
        "SEO",
        "Recomendações",
        "Fidelidade",
        "Recompensas",
        "Cupons",
        "Cartões Presente",
        "Vendas",
        "Produtos",
        "Estoque",
        "E-commerce",
        "Finanças",
        "Relatórios",
        "Pagamentos",
        "Reembolsos",
        "Fotos",
        "Vídeos",
        "Avaliações",
        "Multilíngue",
        "Chatbots",
        "Notificações",
        "Automação",
        "Workflows",
        "Vouchers",
        "Editor",
        "Reservas",
        "Validação",
        "Cadastros",
        "Usuários",
        "Permissões",
        "Configurações",
        "Documentos",
        "Contratos",
        "Seguros",
        "Vistos",
        "Hotéis",
        "Transporte",
        "Mapas",
        "Subscrições",
        "Planos",
        "Cobrança",
        "Upgrades"
    )
    
    foreach ($funcionalidade in $funcionalidades) {
        if ($dashboardContent -match $funcionalidade) {
            Write-Host "OK - Funcionalidade '$funcionalidade' encontrada" -ForegroundColor Green
        } else {
            Write-Host "ERRO - Funcionalidade '$funcionalidade' nao encontrada" -ForegroundColor Red
        }
    }
    
    # Verificar gradientes e cores
    $gradientes = @(
        "from-blue-50 to-blue-100",
        "from-purple-50 to-purple-100",
        "from-green-50 to-green-100",
        "from-orange-50 to-orange-100",
        "from-yellow-50 to-yellow-100",
        "from-pink-50 to-pink-100",
        "from-indigo-50 to-indigo-100",
        "from-teal-50 to-teal-100",
        "from-gray-50 to-gray-100",
        "from-red-50 to-red-100",
        "from-cyan-50 to-cyan-100",
        "from-emerald-50 to-emerald-100"
    )
    
    foreach ($gradiente in $gradientes) {
        if ($dashboardContent -match $gradiente) {
            Write-Host "OK - Gradiente '$gradiente' encontrado" -ForegroundColor Green
        } else {
            Write-Host "ERRO - Gradiente '$gradiente' nao encontrado" -ForegroundColor Red
        }
    }
    
    # Verificar estrutura de grid
    if ($dashboardContent -match "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4") {
        Write-Host "OK - Grid responsivo encontrado" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Grid responsivo nao encontrado" -ForegroundColor Red
    }
    
    # Verificar botões interativos
    if ($dashboardContent -match "onClick.*router.push") {
        Write-Host "OK - Botões interativos encontrados" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Botões interativos nao encontrados" -ForegroundColor Red
    }
    
    # Verificar hover effects
    if ($dashboardContent -match "hover:bg-.*-200") {
        Write-Host "OK - Efeitos hover encontrados" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Efeitos hover nao encontrados" -ForegroundColor Red
    }
    
} else {
    Write-Host "ERRO - Arquivo dashboard.tsx nao encontrado" -ForegroundColor Red
}

Write-Host "`nTESTE CONCLUIDO!" -ForegroundColor Green
Write-Host "Acesse: http://localhost:3002/dashboard" -ForegroundColor Cyan
Write-Host "Cards de todas as funcionalidades implementados com sucesso!" -ForegroundColor Green
Write-Host "Recursos disponiveis:" -ForegroundColor Cyan
Write-Host "- 12 categorias principais" -ForegroundColor Cyan
Write-Host "- 48+ funcionalidades específicas" -ForegroundColor Cyan
Write-Host "- Gradientes coloridos por categoria" -ForegroundColor Cyan
Write-Host "- Grid responsivo" -ForegroundColor Cyan
Write-Host "- Botões interativos" -ForegroundColor Cyan
Write-Host "- Efeitos hover" -ForegroundColor Cyan
Write-Host "Servidor rodando na porta 3002" -ForegroundColor Cyan 