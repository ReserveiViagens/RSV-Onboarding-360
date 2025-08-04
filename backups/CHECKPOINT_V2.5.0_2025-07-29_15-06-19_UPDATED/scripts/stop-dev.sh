#!/bin/bash

# Script de parada para desenvolvimento - Onion RSV 360
# Versão 2.0.0

set -e

echo "🛑 Parando Onion RSV 360 - Ambiente de Desenvolvimento"
echo "=================================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Parar frontend
stop_frontend() {
    log_info "Parando frontend..."
    
    if [ -f "logs/frontend.pid" ]; then
        FRONTEND_PID=$(cat logs/frontend.pid)
        if ps -p $FRONTEND_PID > /dev/null 2>&1; then
            kill $FRONTEND_PID
            log_success "Frontend parado (PID: $FRONTEND_PID)"
        else
            log_warning "Frontend já estava parado"
        fi
        rm -f logs/frontend.pid
    else
        log_warning "PID do frontend não encontrado"
    fi
}

# Parar serviços Docker
stop_docker_services() {
    log_info "Parando serviços Docker..."
    
    if docker-compose ps | grep -q "Up"; then
        docker-compose down
        log_success "Serviços Docker parados"
    else
        log_warning "Serviços Docker já estavam parados"
    fi
}

# Limpar logs
cleanup_logs() {
    log_info "Limpando logs..."
    
    if [ -d "logs" ]; then
        rm -f logs/frontend.pid
        log_success "Logs limpos"
    fi
}

# Mostrar status final
show_final_status() {
    echo ""
    echo "=================================================="
    echo "✅ Onion RSV 360 - Parado com Sucesso"
    echo "=================================================="
    
    # Verificar se ainda há processos rodando
    if docker-compose ps | grep -q "Up"; then
        log_warning "Alguns serviços Docker ainda estão rodando:"
        docker-compose ps
    else
        log_success "Todos os serviços Docker foram parados"
    fi
    
    if [ -f "logs/frontend.pid" ]; then
        FRONTEND_PID=$(cat logs/frontend.pid)
        if ps -p $FRONTEND_PID > /dev/null 2>&1; then
            log_warning "Frontend ainda está rodando (PID: $FRONTEND_PID)"
        fi
    fi
    
    echo ""
    echo "🚀 Para reiniciar: ./scripts/start-dev.sh"
}

# Função principal
main() {
    echo "Parando serviços..."
    
    stop_frontend
    stop_docker_services
    cleanup_logs
    
    show_final_status
}

# Tratamento de erros
trap 'log_error "Erro na linha $LINENO. Saindo..."; exit 1' ERR

# Executar função principal
main "$@" 