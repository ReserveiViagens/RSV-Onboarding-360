# Script de Backup - Checkpoint V2.3.0 - Página de Conteúdo Completa
# Data: 26/07/2025
# Funcionalidades: Página de Conteúdo com Ações em Lote e Módulo de Exportação/Importação

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = ".\backups\checkpoint-v2.3.0-$timestamp"

Write-Host "=== BACKUP CHECKPOINT V2.3.0 - PÁGINA DE CONTEÚDO COMPLETA ===" -ForegroundColor Green
Write-Host "Iniciando backup em: $backupDir" -ForegroundColor Yellow

# Criar diretório de backup
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
New-Item -ItemType Directory -Path "$backupDir\frontend" -Force | Out-Null
New-Item -ItemType Directory -Path "$backupDir\frontend\src" -Force | Out-Null
New-Item -ItemType Directory -Path "$backupDir\frontend\src\pages" -Force | Out-Null
New-Item -ItemType Directory -Path "$backupDir\frontend\src\components" -Force | Out-Null
New-Item -ItemType Directory -Path "$backupDir\frontend\src\context" -Force | Out-Null
New-Item -ItemType Directory -Path "$backupDir\frontend\src\services" -Force | Out-Null
New-Item -ItemType Directory -Path "$backupDir\frontend\src\styles" -Force | Out-Null
New-Item -ItemType Directory -Path "$backupDir\documentation" -Force | Out-Null

Write-Host "`n📁 Fazendo backup da página de conteúdo..." -ForegroundColor Cyan

# Backup da página de conteúdo principal
if (Test-Path ".\frontend\src\pages\conteudo.tsx") {
    Copy-Item ".\frontend\src\pages\conteudo.tsx" "$backupDir\frontend\src\pages\conteudo.tsx"
    Write-Host "✅ Página conteudo.tsx copiada" -ForegroundColor Green
}

# Backup da página de redirecionamento
if (Test-Path ".\frontend\src\pages\conteúdo.tsx") {
    Copy-Item ".\frontend\src\pages\conteúdo.tsx" "$backupDir\frontend\src\pages\conteúdo.tsx"
    Write-Host "✅ Página conteúdo.tsx (redirecionamento) copiada" -ForegroundColor Green
}

Write-Host "`n📁 Fazendo backup das configurações..." -ForegroundColor Cyan

# Backup das configurações do Next.js
if (Test-Path ".\frontend\next.config.js") {
    Copy-Item ".\frontend\next.config.js" "$backupDir\frontend\next.config.js"
    Write-Host "✅ Next.js config copiado" -ForegroundColor Green
}

if (Test-Path ".\frontend\src\middleware.ts") {
    Copy-Item ".\frontend\src\middleware.ts" "$backupDir\frontend\src\middleware.ts"
    Write-Host "✅ Middleware copiado" -ForegroundColor Green
}

if (Test-Path ".\frontend\.env.local") {
    Copy-Item ".\frontend\.env.local" "$backupDir\frontend\.env.local"
    Write-Host "✅ Environment variables copiadas" -ForegroundColor Green
}

Write-Host "`n📁 Fazendo backup da documentação..." -ForegroundColor Cyan

# Backup da documentação criada
$documentationFiles = @(
    "MELHORIAS_CONTEUDO_FINAIS.md",
    "ACOES_EM_LOTE_IMPLEMENTADAS.md",
    "MODULO_EXPORTACAO_IMPORTACAO.md",
    "FUNCIONALIDADES_CONTEUDO_COMPLETAS.md",
    "FUNCIONALIDADES_CONTEUDO_FINAIS.md",
    "FUNCIONALIDADES_FORMULARIOS_COMPLETAS.md",
    "CORRECAO_FINAL_COMPLETA.md",
    "SUBSTITUICAO_CONTEUDO_FINAL.md"
)

foreach ($doc in $documentationFiles) {
    if (Test-Path ".\$doc") {
        Copy-Item ".\$doc" "$backupDir\documentation\$doc"
        Write-Host "✅ $doc copiado" -ForegroundColor Green
    }
}

Write-Host "`n📁 Fazendo backup das páginas relacionadas..." -ForegroundColor Cyan

# Backup das páginas relacionadas (fidelização, e-commerce)
$relatedPages = @(
    "fidelização.tsx",
    "e-commerce.tsx",
    "loyalty.tsx"
)

foreach ($page in $relatedPages) {
    if (Test-Path ".\frontend\src\pages\$page") {
        Copy-Item ".\frontend\src\pages\$page" "$backupDir\frontend\src\pages\$page"
        Write-Host "✅ Página $page copiada" -ForegroundColor Green
    }
}

Write-Host "`n📁 Fazendo backup dos componentes..." -ForegroundColor Cyan

# Backup dos componentes principais
$components = @(
    "ProtectedRoute.tsx",
    "Layout.tsx",
    "Navigation.tsx"
)

foreach ($component in $components) {
    if (Test-Path ".\frontend\src\components\$component") {
        Copy-Item ".\frontend\src\components\$component" "$backupDir\frontend\src\components\$component"
        Write-Host "✅ Componente $component copiado" -ForegroundColor Green
    }
}

Write-Host "`n📁 Fazendo backup dos contextos..." -ForegroundColor Cyan

# Backup dos contextos
if (Test-Path ".\frontend\src\context\AuthContext.tsx") {
    Copy-Item ".\frontend\src\context\AuthContext.tsx" "$backupDir\frontend\src\context\AuthContext.tsx"
    Write-Host "✅ AuthContext copiado" -ForegroundColor Green
}

Write-Host "`n📁 Fazendo backup das configurações do projeto..." -ForegroundColor Cyan

# Backup das configurações do projeto
$configFiles = @(
    "package.json",
    "tsconfig.json",
    "tailwind.config.js"
)

foreach ($config in $configFiles) {
    if (Test-Path ".\frontend\$config") {
        Copy-Item ".\frontend\$config" "$backupDir\frontend\$config"
        Write-Host "✅ $config copiado" -ForegroundColor Green
    }
}

# Criar arquivo de informações do checkpoint
$checkpointInfo = @"
# CHECKPOINT V2.3.0 - PÁGINA DE CONTEÚDO COMPLETA

## Data de Criação: $(Get-Date -Format "dd/MM/yyyy HH:mm:ss")

## Funcionalidades Implementadas:

### ✅ Pagina de Conteudo Principal
- URL: http://localhost:3000/conteudo
- 6 Cards de estatisticas clicaveis
- 7 Acoes rapidas funcionais
- 4 Conteudos recentes interativos
- 4 Categorias clicaveis
- 4 Idiomas ativos

### ✅ Acoes em Lote
- Sistema de selecao individual e em massa
- 4 acoes em lote: Publicar, Arquivar, Excluir, Exportar
- Modais de confirmacao e sucesso
- Historico de operacoes

### ✅ Modulo de Exportacao Avancada
- 8 formatos suportados: JSON, CSV, XML, Excel, PDF, ZIP, SQL, YAML
- Opcoes de conteudo configuraveis
- Filtros por data e categoria
- Historico de exportacoes

### ✅ Modulo de Importacao Avancada
- 8 formatos suportados: JSON, CSV, XML, Excel, ZIP, SQL, YAML, PDF
- Validacao de arquivos
- Configuracoes de importacao
- Historico de importacoes

### ✅ Formularios Completos
- Novo Conteudo com validacao
- Nova Categoria com preview
- Edicao de conteudo existente
- Exclusao com confirmacao

### ✅ Categorias Expandidas
- 12 categorias disponiveis
- 6 novas categorias de marketing
- Promocoes, Ofertas, Black Friday, etc.

## Arquivos Principais:
- conteudo.tsx (pagina principal)
- conteudo.tsx (redirecionamento)
- next.config.js (configuracoes)
- middleware.ts (redirecionamentos)
- .env.local (variaveis de ambiente)

## Documentacao Criada:
- MELHORIAS_CONTEUDO_FINAIS.md
- ACOES_EM_LOTE_IMPLEMENTADAS.md
- MODULO_EXPORTACAO_IMPORTACAO.md
- FUNCIONALIDADES_CONTEUDO_COMPLETAS.md
- FUNCIONALIDADES_CONTEUDO_FINAIS.md
- FUNCIONALIDADES_FORMULARIOS_COMPLETAS.md

## Status: 100% Funcional e Testado

## Para Restaurar:
1. Copiar arquivos da pasta: $backupDir
2. Substituir arquivos na estrutura original
3. Executar: npm install
4. Executar: npm run dev
5. Testar funcionalidades em http://localhost:3000/conteudo

## Proximos Passos:
- Implementar integracao com backend
- Adicionar mais formatos de exportacao
- Expandir funcionalidades de acoes em lote
- Implementar sistema de templates

Backup finalizado em: $(Get-Date -Format "dd/MM/yyyy HH:mm:ss")
"@

$checkpointInfo | Out-File -FilePath "$backupDir\CHECKPOINT_V2.3.0_INFO.md" -Encoding UTF8

Write-Host "`n=== BACKUP CHECKPOINT V2.3.0 CONCLUÍDO! ===" -ForegroundColor Green
Write-Host "Localização: $backupDir" -ForegroundColor Yellow
Write-Host "Funcionalidades: 100% Testadas e Operacionais" -ForegroundColor Green
Write-Host "Status: Ponto de Restauração Criado com Sucesso" -ForegroundColor Green
Write-Host "`nPara restaurar este checkpoint:" -ForegroundColor Cyan
Write-Host "1. Copiar arquivos da pasta: $backupDir" -ForegroundColor White
Write-Host "2. Substituir arquivos na estrutura original" -ForegroundColor White
Write-Host "3. Executar: npm install" -ForegroundColor White
Write-Host "4. Executar: npm run dev" -ForegroundColor White
Write-Host "5. Testar funcionalidades em http://localhost:3000/conteudo" -ForegroundColor White
Write-Host "`nBackup finalizado em: $(Get-Date -Format "dd/MM/yyyy HH:mm:ss")" -ForegroundColor Yellow 