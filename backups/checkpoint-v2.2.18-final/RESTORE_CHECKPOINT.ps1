# Script de Restauração do Checkpoint v2.2.18
# Onion RSV 360

param(
    [string]$RestorePath = "C:\Users\RSV\Desktop\Onion RSV\rsv-onion360"
)

Write-Host "🚀 Restaurando Checkpoint v2.2.18 - Onion RSV 360" -ForegroundColor Green
Write-Host "⏰ Data: $(Get-Date)" -ForegroundColor Yellow
Write-Host "📁 Caminho de Restauração: $RestorePath" -ForegroundColor Cyan

# Verificar se o diretório de destino existe
if (!(Test-Path $RestorePath)) {
    Write-Host "❌ Erro: Diretório de destino não encontrado!" -ForegroundColor Red
    exit 1
}

# Obter o diretório atual do script
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "📂 Restaurando arquivos..." -ForegroundColor Yellow

# Restaurar páginas
$PagesSource = Join-Path $ScriptDir "*.tsx"
$PagesDest = Join-Path $RestorePath "frontend\src\pages\"
if (Test-Path $PagesDest) {
    Copy-Item $PagesSource $PagesDest -Force
    Write-Host "✅ Páginas restauradas" -ForegroundColor Green
}

# Restaurar componentes
$ComponentsSource = Join-Path $ScriptDir "*.tsx"
$ComponentsDest = Join-Path $RestorePath "frontend\src\components\"
if (Test-Path $ComponentsDest) {
    Copy-Item $ComponentsSource $ComponentsDest -Force
    Write-Host "✅ Componentes restaurados" -ForegroundColor Green
}

# Restaurar contextos
$ContextSource = Join-Path $ScriptDir "*.tsx"
$ContextDest = Join-Path $RestorePath "frontend\src\context\"
if (Test-Path $ContextDest) {
    Copy-Item $ContextSource $ContextDest -Force
    Write-Host "✅ Contextos restaurados" -ForegroundColor Green
}

# Restaurar serviços
$ServicesSource = Join-Path $ScriptDir "*.ts"
$ServicesDest = Join-Path $RestorePath "frontend\src\services\"
if (Test-Path $ServicesDest) {
    Copy-Item $ServicesSource $ServicesDest -Force
    Write-Host "✅ Serviços restaurados" -ForegroundColor Green
}

# Restaurar arquivos de configuração
$ConfigFiles = @("package.json", "tsconfig.json", "tailwind.config.js")
foreach ($file in $ConfigFiles) {
    $Source = Join-Path $ScriptDir $file
    $Dest = Join-Path $RestorePath "frontend\$file"
    if (Test-Path $Source) {
        Copy-Item $Source $Dest -Force
        Write-Host "✅ $file restaurado" -ForegroundColor Green
    }
}

# Restaurar documentação
$DocsSource = Join-Path $ScriptDir "*.md"
$DocsDest = $RestorePath
Copy-Item $DocsSource $DocsDest -Force
Write-Host "✅ Documentação restaurada" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Restauração Concluída!" -ForegroundColor Green
Write-Host "📊 Checkpoint v2.2.18 restaurado com sucesso" -ForegroundColor Cyan
Write-Host "🚀 Para iniciar o servidor, execute: npm run dev" -ForegroundColor Yellow
Write-Host "🌐 Acesse: http://localhost:3000" -ForegroundColor Yellow

Write-Host ""
Write-Host "📋 Páginas Disponíveis:" -ForegroundColor White
Write-Host "   • http://localhost:3000/travel" -ForegroundColor Cyan
Write-Host "   • http://localhost:3000/calendar" -ForegroundColor Cyan
Write-Host "   • http://localhost:3000/reports" -ForegroundColor Cyan
Write-Host "   • http://localhost:3000/tickets" -ForegroundColor Cyan
Write-Host "   • http://localhost:3000/attractions" -ForegroundColor Cyan

Write-Host ""
Write-Host "✅ Restauração finalizada em: $(Get-Date)" -ForegroundColor Green 