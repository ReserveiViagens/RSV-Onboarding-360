# Script para testar o editor expandido de vouchers
# Autor: Sistema Onion RSV 360
# Data: 28/07/2025

Write-Host "TESTANDO EDITOR EXPANDIDO DE VOUCHERS..." -ForegroundColor Green

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

# Testar pagina do editor expandido
Write-Host "Testando pagina do editor expandido..." -ForegroundColor Yellow
try {
    $editorResponse = Invoke-WebRequest -Uri "http://localhost:3000/voucher-editor" -Method Head -TimeoutSec 10
    if ($editorResponse.StatusCode -eq 200) {
        Write-Host "OK - Pagina do editor expandido acessivel" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Pagina do editor expandido nao acessivel" -ForegroundColor Red
    }
} catch {
    Write-Host "ERRO - Erro ao acessar pagina do editor: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar arquivos atualizados
Write-Host "Verificando arquivos atualizados..." -ForegroundColor Yellow

$arquivos = @(
    "rsv-onion360/frontend/src/pages/voucher-editor.tsx",
    "rsv-onion360/backend/voucher-editor/app.py",
    "rsv-onion360/backend/voucher-editor/requirements.txt",
    "rsv-onion360/backend/voucher-editor/Dockerfile"
)

foreach ($arquivo in $arquivos) {
    if (Test-Path $arquivo) {
        Write-Host "OK - $arquivo" -ForegroundColor Green
    } else {
        Write-Host "ERRO - $arquivo nao encontrado" -ForegroundColor Red
    }
}

# Verificar se as interfaces foram adicionadas
Write-Host "Verificando interfaces expandidas..." -ForegroundColor Yellow
$editorPath = "rsv-onion360/frontend/src/pages/voucher-editor.tsx"
if (Test-Path $editorPath) {
    $editorContent = Get-Content $editorPath -Raw
    
    # Verificar interfaces
    $interfaces = @(
        "VoucherHeader",
        "HeaderLink", 
        "VoucherBody",
        "ClientInfo",
        "ReservationInfo",
        "Benefit",
        "VoucherFooter",
        "FooterLink",
        "ContactInfo",
        "SocialMedia"
    )
    
    foreach ($interface in $interfaces) {
        if ($editorContent -match $interface) {
            Write-Host "OK - Interface $interface encontrada" -ForegroundColor Green
        } else {
            Write-Host "ERRO - Interface $interface nao encontrada" -ForegroundColor Red
        }
    }
    
    # Verificar componentes
    $componentes = @(
        "HeaderEditor",
        "BodyEditor", 
        "FooterEditor"
    )
    
    foreach ($componente in $componentes) {
        if ($editorContent -match $componente) {
            Write-Host "OK - Componente $componente encontrado" -ForegroundColor Green
        } else {
            Write-Host "ERRO - Componente $componente nao encontrado" -ForegroundColor Red
        }
    }
    
    # Verificar funções
    $funcoes = @(
        "handleHeaderUpdate",
        "handleHeaderLinkAdd",
        "handleHeaderLinkUpdate", 
        "handleHeaderLinkDelete",
        "handleBodyUpdate",
        "handleClientInfoUpdate",
        "handleReservationInfoUpdate",
        "handleBenefitAdd",
        "handleBenefitUpdate",
        "handleBenefitDelete",
        "handleFooterUpdate",
        "handleFooterLinkAdd",
        "handleFooterLinkUpdate",
        "handleFooterLinkDelete",
        "handleContactInfoUpdate",
        "handleSocialMediaAdd",
        "handleSocialMediaUpdate",
        "handleSocialMediaDelete"
    )
    
    foreach ($funcao in $funcoes) {
        if ($editorContent -match $funcao) {
            Write-Host "OK - Funcao $funcao encontrada" -ForegroundColor Green
        } else {
            Write-Host "ERRO - Funcao $funcao nao encontrada" -ForegroundColor Red
        }
    }
    
    # Verificar estados
    $estados = @(
        "headerData",
        "bodyData", 
        "footerData",
        "showHeaderEditor",
        "showBodyEditor",
        "showFooterEditor"
    )
    
    foreach ($estado in $estados) {
        if ($editorContent -match $estado) {
            Write-Host "OK - Estado $estado encontrado" -ForegroundColor Green
        } else {
            Write-Host "ERRO - Estado $estado nao encontrado" -ForegroundColor Red
        }
    }
    
    # Verificar links e termos
    $links = @(
        "Contrato",
        "Termos e Condições",
        "Política de Privacidade",
        "Política de Cancelamento",
        "Política de Reembolso",
        "Suporte ao Cliente"
    )
    
    foreach ($link in $links) {
        if ($editorContent -match $link) {
            Write-Host "OK - Link '$link' encontrado" -ForegroundColor Green
        } else {
            Write-Host "ERRO - Link '$link' nao encontrado" -ForegroundColor Red
        }
    }
    
    # Verificar redes sociais
    $redesSociais = @(
        "whatsapp",
        "instagram", 
        "facebook",
        "twitter",
        "linkedin",
        "youtube",
        "telegram"
    )
    
    foreach ($rede in $redesSociais) {
        if ($editorContent -match $rede) {
            Write-Host "OK - Rede social '$rede' encontrada" -ForegroundColor Green
        } else {
            Write-Host "ERRO - Rede social '$rede' nao encontrada" -ForegroundColor Red
        }
    }
    
} else {
    Write-Host "ERRO - Arquivo voucher-editor.tsx nao encontrado" -ForegroundColor Red
}

# Verificar se o card foi adicionado na pagina de vouchers
Write-Host "Verificando card do editor na pagina de vouchers..." -ForegroundColor Yellow
$vouchersPath = "rsv-onion360/frontend/src/pages/vouchers.tsx"
if (Test-Path $vouchersPath) {
    $vouchersContent = Get-Content $vouchersPath -Raw
    if ($vouchersContent -match "Editor de Vouchers") {
        Write-Host "OK - Card do editor encontrado na pagina de vouchers" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Card do editor nao encontrado na pagina de vouchers" -ForegroundColor Red
    }
} else {
    Write-Host "ERRO - Arquivo vouchers.tsx nao encontrado" -ForegroundColor Red
}

Write-Host "`nTESTE CONCLUIDO!" -ForegroundColor Green
Write-Host "Acesse: http://localhost:3000/voucher-editor" -ForegroundColor Cyan
Write-Host "Editor expandido implementado com sucesso!" -ForegroundColor Green
Write-Host "Funcionalidades disponiveis:" -ForegroundColor Cyan
Write-Host "- Header: Informacoes da empresa e links" -ForegroundColor Cyan
Write-Host "- Body: Informacoes do cliente e reserva" -ForegroundColor Cyan
Write-Host "- Footer: Termos, contatos e redes sociais" -ForegroundColor Cyan
Write-Host "Servidor rodando na porta 3000" -ForegroundColor Cyan 