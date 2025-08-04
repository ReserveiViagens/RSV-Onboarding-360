# Script Simples para Atualizar Backup
Write-Host "=== ATUALIZANDO BACKUP ===" -ForegroundColor Cyan

# Encontrar o backup mais recente
$backups = Get-ChildItem -Path "rsv-onion360/backups" -Directory | Sort-Object LastWriteTime -Descending
$latestBackup = $backups[0]

if ($latestBackup) {
    Write-Host "1. Backup encontrado: $($latestBackup.Name)" -ForegroundColor Yellow
    
    # Criar backup atualizado
    $updatedBackupName = "$($latestBackup.Name)_UPDATED"
    $updatedBackupPath = "rsv-onion360/backups/$updatedBackupName"
    
    Write-Host "2. Criando versão atualizada..." -ForegroundColor Yellow
    Copy-Item -Path $latestBackup.FullName -Destination $updatedBackupPath -Recurse -Force
    
    # Atualizar arquivos principais
    Write-Host "3. Atualizando arquivos..." -ForegroundColor Yellow
    
    # Frontend
    Copy-Item -Path "rsv-onion360/frontend/src/pages/users.tsx" -Destination "$updatedBackupPath/frontend/src/pages/users.tsx" -Force
    Copy-Item -Path "rsv-onion360/frontend/src/pages/permissions.tsx" -Destination "$updatedBackupPath/frontend/src/pages/permissions.tsx" -Force
    Copy-Item -Path "rsv-onion360/frontend/src/pages/settings.tsx" -Destination "$updatedBackupPath/frontend/src/pages/settings.tsx" -Force
    Copy-Item -Path "rsv-onion360/frontend/src/pages/vouchers.tsx" -Destination "$updatedBackupPath/frontend/src/pages/vouchers.tsx" -Force
    Copy-Item -Path "rsv-onion360/frontend/src/pages/voucher-editor.tsx" -Destination "$updatedBackupPath/frontend/src/pages/voucher-editor.tsx" -Force
    Copy-Item -Path "rsv-onion360/frontend/src/pages/dashboard.tsx" -Destination "$updatedBackupPath/frontend/src/pages/dashboard.tsx" -Force
    Copy-Item -Path "rsv-onion360/frontend/src/pages/login.tsx" -Destination "$updatedBackupPath/frontend/src/pages/login.tsx" -Force
    Copy-Item -Path "rsv-onion360/frontend/src/context/AuthContext.tsx" -Destination "$updatedBackupPath/frontend/src/context/AuthContext.tsx" -Force
    Copy-Item -Path "rsv-onion360/frontend/next.config.js" -Destination "$updatedBackupPath/frontend/next.config.js" -Force
    
    # Backend
    if (Test-Path "rsv-onion360/backend/vouchers") {
        Copy-Item -Path "rsv-onion360/backend/vouchers" -Destination "$updatedBackupPath/backend/" -Recurse -Force
    }
    if (Test-Path "rsv-onion360/backend/voucher-editor") {
        Copy-Item -Path "rsv-onion360/backend/voucher-editor" -Destination "$updatedBackupPath/backend/" -Recurse -Force
    }
    
    # Scripts
    Copy-Item -Path "rsv-onion360/scripts" -Destination "$updatedBackupPath/" -Recurse -Force
    
    # Documentação
    $updateInfo = "Backup atualizado com implementações v2.5.0 - $(Get-Date)"
    $updateInfo | Out-File -FilePath "$updatedBackupPath/ATUALIZACAO.md" -Encoding UTF8
    
    Write-Host ""
    Write-Host "=== BACKUP ATUALIZADO! ===" -ForegroundColor Green
    Write-Host "Original: $($latestBackup.Name)" -ForegroundColor Cyan
    Write-Host "Atualizado: $updatedBackupName" -ForegroundColor Cyan
    
} else {
    Write-Host "Nenhum backup encontrado" -ForegroundColor Red
} 