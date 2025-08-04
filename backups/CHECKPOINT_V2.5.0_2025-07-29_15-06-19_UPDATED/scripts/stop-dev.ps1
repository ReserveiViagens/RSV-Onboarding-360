# Script de parada para desenvolvimento - Onion RSV 360
# Versão 2.0.0 - PowerShell

param(
    [switch]$Force
)

# Configurações
$ErrorActionPreference = "Stop"

# Cores para output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$White = "White"

# Função para log colorido
function Write-LogInfo {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Blue
}

function Write-LogSuccess {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Green
}

function Write-LogWarning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-LogError {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

Write-Host "🛑 Parando Onion RSV 360 - Ambiente de Desenvolvimento" -ForegroundColor $White
Write-Host "==================================================" -ForegroundColor $White

# Parar frontend
function Stop-Frontend {
    Write-LogInfo "Parando frontend..."
    
    if (Test-Path "logs\frontend.pid") {
        $frontendPid = Get-Content "logs\frontend.pid"
        try {
            $process = Get-Process -Id $frontendPid -ErrorAction Stop
            Stop-Process -Id $frontendPid -Force
            Write-LogSuccess "Frontend parado (PID: $frontendPid)"
        }
        catch {
            Write-LogWarning "Frontend já estava parado"
        }
        Remove-Item "logs\frontend.pid" -ErrorAction SilentlyContinue
    }
    else {
        Write-LogWarning "PID do frontend não encontrado"
    }
    
    # Parar todos os processos Node.js relacionados ao Next.js
    $nodeProcesses = Get-Process | Where-Object { 
        $_.ProcessName -eq "node" -and 
        $_.CommandLine -like "*next*" -and 
        $_.CommandLine -like "*dev*" 
    }
    
    if ($nodeProcesses) {
        foreach ($process in $nodeProcesses) {
            try {
                Stop-Process -Id $process.Id -Force
                Write-LogSuccess "Processo Node.js parado (PID: $($process.Id))"
            }
            catch {
                Write-LogWarning "Erro ao parar processo Node.js (PID: $($process.Id))"
            }
        }
    }
}

# Parar serviços Docker
function Stop-DockerServices {
    Write-LogInfo "Parando serviços Docker..."
    
    try {
        $dockerStatus = docker-compose ps
        if ($dockerStatus -match "Up") {
            docker-compose down
            Write-LogSuccess "Serviços Docker parados"
        }
        else {
            Write-LogWarning "Serviços Docker já estavam parados"
        }
    }
    catch {
        Write-LogWarning "Erro ao parar serviços Docker"
    }
}

# Limpar logs
function Clear-Logs {
    Write-LogInfo "Limpando logs..."
    
    if (Test-Path "logs") {
        Remove-Item "logs\frontend.pid" -ErrorAction SilentlyContinue
        Write-LogSuccess "Logs limpos"
    }
}

# Mostrar status final
function Show-FinalStatus {
    Write-Host ""
    Write-Host "==================================================" -ForegroundColor $White
    Write-Host "✅ Onion RSV 360 - Parado com Sucesso" -ForegroundColor $White
    Write-Host "==================================================" -ForegroundColor $White
    
    # Verificar se ainda há processos rodando
    try {
        $dockerStatus = docker-compose ps
        if ($dockerStatus -match "Up") {
            Write-LogWarning "Alguns serviços Docker ainda estão rodando:"
            Write-Host $dockerStatus
        }
        else {
            Write-LogSuccess "Todos os serviços Docker foram parados"
        }
    }
    catch {
        Write-LogSuccess "Serviços Docker parados"
    }
    
    # Verificar processos Node.js
    $nodeProcesses = Get-Process | Where-Object { 
        $_.ProcessName -eq "node" -and 
        $_.CommandLine -like "*next*" 
    }
    
    if ($nodeProcesses) {
        Write-LogWarning "Alguns processos Node.js ainda estão rodando:"
        foreach ($process in $nodeProcesses) {
            Write-Host "  PID: $($process.Id) - $($process.CommandLine)" -ForegroundColor $Yellow
        }
    }
    else {
        Write-LogSuccess "Todos os processos Node.js foram parados"
    }
    
    Write-Host ""
    Write-Host "🚀 Para reiniciar: .\scripts\start-dev.ps1" -ForegroundColor $White
}

# Função principal
function Main {
    Write-Host "Parando serviços..." -ForegroundColor $White
    
    Stop-Frontend
    Stop-DockerServices
    Clear-Logs
    
    Show-FinalStatus
}

# Executar função principal
try {
    Main
}
catch {
    Write-LogError "Erro: $($_.Exception.Message)"
    exit 1
} 