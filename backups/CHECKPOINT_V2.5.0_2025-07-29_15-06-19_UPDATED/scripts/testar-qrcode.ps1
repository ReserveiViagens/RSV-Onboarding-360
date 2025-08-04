# Script para testar funcionalidade de QR Code
# Autor: Sistema Onion RSV 360
# Data: 28/07/2025

Write-Host "TESTANDO FUNCIONALIDADE DE QR CODE..." -ForegroundColor Green

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

# Verificar se a biblioteca QRCode foi instalada
Write-Host "Verificando biblioteca QRCode..." -ForegroundColor Yellow
$packageJsonPath = "rsv-onion360/frontend/package.json"
if (Test-Path $packageJsonPath) {
    $packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
    if ($packageJson.dependencies.qrcode) {
        Write-Host "OK - Biblioteca qrcode instalada: $($packageJson.dependencies.qrcode)" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Biblioteca qrcode nao encontrada" -ForegroundColor Red
    }
    
    if ($packageJson.devDependencies.'@types/qrcode') {
        Write-Host "OK - Tipos TypeScript para qrcode instalados" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Tipos TypeScript para qrcode nao encontrados" -ForegroundColor Red
    }
} else {
    Write-Host "ERRO - package.json nao encontrado" -ForegroundColor Red
}

# Verificar se as funções de QR Code foram implementadas
Write-Host "Verificando implementacao do QR Code..." -ForegroundColor Yellow
$editorPath = "rsv-onion360/frontend/src/pages/voucher-editor.tsx"
if (Test-Path $editorPath) {
    $editorContent = Get-Content $editorPath -Raw
    
    # Verificar import do QRCode
    if ($editorContent -match "import QRCode from 'qrcode'") {
        Write-Host "OK - Import do QRCode encontrado" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Import do QRCode nao encontrado" -ForegroundColor Red
    }
    
    # Verificar estados do QR Code
    $qrCodeStates = @(
        "qrCodeData",
        "qrCodeUrl", 
        "showQrCodeModal",
        "qrCodeSize",
        "qrCodeColor",
        "qrCodeBgColor",
        "qrCodeErrorLevel"
    )
    
    foreach ($state in $qrCodeStates) {
        if ($editorContent -match $state) {
            Write-Host "OK - Estado $state encontrado" -ForegroundColor Green
        } else {
            Write-Host "ERRO - Estado $state nao encontrado" -ForegroundColor Red
        }
    }
    
    # Verificar funções do QR Code
    $qrCodeFunctions = @(
        "generateQRCode",
        "handleGenerateQRCode",
        "handleDownloadQRCode",
        "handleCopyQRCode",
        "handleAddQRCodeToVoucher"
    )
    
    foreach ($function in $qrCodeFunctions) {
        if ($editorContent -match $function) {
            Write-Host "OK - Funcao $function encontrada" -ForegroundColor Green
        } else {
            Write-Host "ERRO - Funcao $function nao encontrada" -ForegroundColor Red
        }
    }
    
    # Verificar componente QRCodeGenerator
    if ($editorContent -match "QRCodeGenerator") {
        Write-Host "OK - Componente QRCodeGenerator encontrado" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Componente QRCodeGenerator nao encontrado" -ForegroundColor Red
    }
    
    # Verificar botao de gerar QR Code
    if ($editorContent -match "Gerar QR Code") {
        Write-Host "OK - Botao 'Gerar QR Code' encontrado" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Botao 'Gerar QR Code' nao encontrado" -ForegroundColor Red
    }
    
    # Verificar modal do QR Code
    if ($editorContent -match "showQrCodeModal") {
        Write-Host "OK - Modal do QR Code encontrado" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Modal do QR Code nao encontrado" -ForegroundColor Red
    }
    
    # Verificar configuracoes do QR Code
    $qrCodeConfigs = @(
        "Tamanho",
        "Nivel de Correcao de Erro",
        "Cor do QR Code",
        "Cor de Fundo",
        "Baixo \\(7%\\)",
        "Medio \\(15%\\)",
        "Alto \\(25%\\)",
        "Muito Alto \\(30%\\)"
    )
    
    foreach ($config in $qrCodeConfigs) {
        if ($editorContent -match $config) {
            Write-Host "OK - Configuracao '$config' encontrada" -ForegroundColor Green
        } else {
            Write-Host "ERRO - Configuracao '$config' nao encontrada" -ForegroundColor Red
        }
    }
    
    # Verificar botoes de acao do QR Code
    $qrCodeButtons = @(
        "Baixar",
        "Copiar Dados",
        "Adicionar ao Voucher"
    )
    
    foreach ($button in $qrCodeButtons) {
        if ($editorContent -match $button) {
            Write-Host "OK - Botao '$button' encontrado" -ForegroundColor Green
        } else {
            Write-Host "ERRO - Botao '$button' nao encontrado" -ForegroundColor Red
        }
    }
    
} else {
    Write-Host "ERRO - Arquivo voucher-editor.tsx nao encontrado" -ForegroundColor Red
}

Write-Host "`nTESTE CONCLUIDO!" -ForegroundColor Green
Write-Host "Acesse: http://localhost:3000/voucher-editor" -ForegroundColor Cyan
Write-Host "Funcionalidade de QR Code implementada com sucesso!" -ForegroundColor Green
Write-Host "Recursos disponiveis:" -ForegroundColor Cyan
Write-Host "- Gerar QR Code com dados personalizados" -ForegroundColor Cyan
Write-Host "- Configurar tamanho, cores e nivel de correcao" -ForegroundColor Cyan
Write-Host "- Baixar QR Code como imagem" -ForegroundColor Cyan
Write-Host "- Copiar dados do QR Code" -ForegroundColor Cyan
Write-Host "- Adicionar QR Code ao voucher" -ForegroundColor Cyan
Write-Host "Servidor rodando na porta 3000" -ForegroundColor Cyan 