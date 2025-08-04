#!/bin/bash

# Script de inicialização para desenvolvimento - Onion RSV 360
# Versão 2.0.0

set -e

echo "🚀 Iniciando Onion RSV 360 - Ambiente de Desenvolvimento"
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

# Verificar se Docker está rodando
check_docker() {
    log_info "Verificando Docker..."
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker não está rodando. Por favor, inicie o Docker e tente novamente."
        exit 1
    fi
    log_success "Docker está rodando"
}

# Verificar se Docker Compose está disponível
check_docker_compose() {
    log_info "Verificando Docker Compose..."
    if ! docker-compose --version > /dev/null 2>&1; then
        log_error "Docker Compose não está disponível. Por favor, instale o Docker Compose."
        exit 1
    fi
    log_success "Docker Compose está disponível"
}

# Verificar se Node.js está instalado (para frontend)
check_node() {
    log_info "Verificando Node.js..."
    if ! node --version > /dev/null 2>&1; then
        log_warning "Node.js não está instalado. O frontend não será iniciado automaticamente."
        return 1
    fi
    log_success "Node.js está disponível"
    return 0
}

# Verificar se Python está instalado
check_python() {
    log_info "Verificando Python..."
    if ! python3 --version > /dev/null 2>&1; then
        log_error "Python 3 não está instalado. Por favor, instale o Python 3."
        exit 1
    fi
    log_success "Python 3 está disponível"
}

# Criar arquivo .env se não existir
setup_env() {
    log_info "Configurando variáveis de ambiente..."
    if [ ! -f ".env" ]; then
        log_warning "Arquivo .env não encontrado. Criando a partir do .env.example..."
        if [ -f "env.example" ]; then
            cp env.example .env
            log_success "Arquivo .env criado"
        else
            log_error "Arquivo env.example não encontrado"
            exit 1
        fi
    else
        log_success "Arquivo .env já existe"
    fi
}

# Instalar dependências do frontend
setup_frontend() {
    log_info "Configurando frontend..."
    cd frontend
    
    if [ ! -d "node_modules" ]; then
        log_info "Instalando dependências do frontend..."
        npm install
        log_success "Dependências do frontend instaladas"
    else
        log_success "Dependências do frontend já instaladas"
    fi
    
    cd ..
}

# Instalar dependências do backend
setup_backend() {
    log_info "Configurando backend..."
    cd backend
    
    if [ ! -d "venv" ]; then
        log_info "Criando ambiente virtual Python..."
        python3 -m venv venv
        log_success "Ambiente virtual criado"
    fi
    
    log_info "Ativando ambiente virtual..."
    source venv/bin/activate
    
    log_info "Instalando dependências do backend..."
    pip install -r requirements.txt
    log_success "Dependências do backend instaladas"
    
    deactivate
    cd ..
}

# Iniciar serviços com Docker Compose
start_services() {
    log_info "Iniciando serviços com Docker Compose..."
    
    # Parar serviços existentes
    docker-compose down 2>/dev/null || true
    
    # Construir e iniciar serviços
    docker-compose up --build -d
    
    log_success "Serviços iniciados com Docker Compose"
}

# Aguardar serviços ficarem prontos
wait_for_services() {
    log_info "Aguardando serviços ficarem prontos..."
    
    # Aguardar PostgreSQL
    log_info "Aguardando PostgreSQL..."
    timeout=30
    while ! docker-compose exec -T postgres pg_isready -U user > /dev/null 2>&1; do
        if [ $timeout -le 0 ]; then
            log_error "Timeout aguardando PostgreSQL"
            exit 1
        fi
        sleep 1
        timeout=$((timeout - 1))
    done
    log_success "PostgreSQL está pronto"
    
    # Aguardar Redis
    log_info "Aguardando Redis..."
    timeout=30
    while ! docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; do
        if [ $timeout -le 0 ]; then
            log_error "Timeout aguardando Redis"
            exit 1
        fi
        sleep 1
        timeout=$((timeout - 1))
    done
    log_success "Redis está pronto"
}

# Executar migrações do banco de dados
run_migrations() {
    log_info "Executando migrações do banco de dados..."
    
    cd backend
    source venv/bin/activate
    
    # Verificar se alembic está configurado
    if [ -f "alembic.ini" ]; then
        alembic upgrade head
        log_success "Migrações executadas"
    else
        log_warning "Alembic não configurado. Pulando migrações."
    fi
    
    deactivate
    cd ..
}

# Iniciar frontend em desenvolvimento
start_frontend_dev() {
    if check_node; then
        log_info "Iniciando frontend em modo desenvolvimento..."
        cd frontend
        
        # Iniciar em background
        npm run dev > ../logs/frontend.log 2>&1 &
        FRONTEND_PID=$!
        echo $FRONTEND_PID > ../logs/frontend.pid
        
        log_success "Frontend iniciado (PID: $FRONTEND_PID)"
        cd ..
    else
        log_warning "Frontend não iniciado - Node.js não disponível"
    fi
}

# Criar diretório de logs
setup_logs() {
    log_info "Configurando diretório de logs..."
    mkdir -p logs
    log_success "Diretório de logs criado"
}

# Mostrar status dos serviços
show_status() {
    echo ""
    echo "=================================================="
    echo "🎉 Onion RSV 360 - Status dos Serviços"
    echo "=================================================="
    
    # Status do Docker Compose
    if docker-compose ps | grep -q "Up"; then
        log_success "Serviços Docker: Ativos"
        docker-compose ps
    else
        log_error "Serviços Docker: Inativos"
    fi
    
    # Status do frontend
    if [ -f "logs/frontend.pid" ]; then
        FRONTEND_PID=$(cat logs/frontend.pid)
        if ps -p $FRONTEND_PID > /dev/null 2>&1; then
            log_success "Frontend: Ativo (PID: $FRONTEND_PID)"
        else
            log_error "Frontend: Inativo"
        fi
    else
        log_warning "Frontend: Não iniciado"
    fi
    
    echo ""
    echo "🌐 URLs de Acesso:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:5000"
    echo "  Core Service: http://localhost:5000"
    echo "  Adminer (DB): http://localhost:8080"
    echo ""
    echo "📝 Logs:"
    echo "  Frontend: logs/frontend.log"
    echo "  Docker: docker-compose logs -f"
    echo ""
    echo "🛑 Para parar: ./scripts/stop-dev.sh"
}

# Função principal
main() {
    echo "Iniciando verificação de pré-requisitos..."
    
    check_docker
    check_docker_compose
    check_python
    
    echo ""
    echo "Configurando ambiente..."
    
    setup_env
    setup_logs
    setup_frontend
    setup_backend
    
    echo ""
    echo "Iniciando serviços..."
    
    start_services
    wait_for_services
    run_migrations
    start_frontend_dev
    
    show_status
}

# Tratamento de erros
trap 'log_error "Erro na linha $LINENO. Saindo..."; exit 1' ERR

# Executar função principal
main "$@" 