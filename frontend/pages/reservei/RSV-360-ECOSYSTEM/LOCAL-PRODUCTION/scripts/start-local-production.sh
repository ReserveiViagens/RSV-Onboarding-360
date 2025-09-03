#!/bin/bash

# 🚀 SCRIPT DE INICIALIZAÇÃO AUTOMATIZADA
# RSV 360° ECOSYSTEM - Ambiente de Produção Local

set -e  # Parar em caso de erro

# 🎨 Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 📋 Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# 🏗️ Banner de inicialização
echo -e "${PURPLE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║           🏭 RSV 360° ECOSYSTEM - PRODUÇÃO LOCAL            ║"
echo "║                                                              ║"
echo "║              Inicialização Automatizada Completa             ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# 📁 Verificar se estamos no diretório correto
if [ ! -f "docker-compose.local.yml" ]; then
    error "Arquivo docker-compose.local.yml não encontrado!"
    error "Execute este script no diretório LOCAL-PRODUCTION/"
    exit 1
fi

# 🔍 Verificar dependências
log "🔍 Verificando dependências..."

# Verificar Docker
if ! command -v docker &> /dev/null; then
    error "Docker não está instalado ou não está no PATH"
    exit 1
fi

# Verificar Docker Compose
if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose não está instalado ou não está no PATH"
    exit 1
fi

# Verificar se Docker está rodando
if ! docker info &> /dev/null; then
    error "Docker não está rodando. Inicie o Docker Desktop primeiro."
    exit 1
fi

success "✅ Todas as dependências estão disponíveis"

# 🧹 Limpeza prévia
log "🧹 Limpando containers e volumes antigos..."
docker-compose -f docker-compose.local.yml down --volumes --remove-orphans 2>/dev/null || true
docker system prune -f 2>/dev/null || true

# 📦 Construir imagens
log "📦 Construindo imagens Docker..."
docker-compose -f docker-compose.local.yml build --no-cache

# 🗄️ Inicializar banco de dados
log "🗄️ Inicializando banco de dados..."
docker-compose -f docker-compose.local.yml up -d db-local redis-local

# ⏳ Aguardar banco estar pronto
log "⏳ Aguardando banco de dados estar pronto..."
sleep 10

# 🔍 Verificar saúde do banco
log "🔍 Verificando saúde do banco de dados..."
for i in {1..30}; do
    if docker-compose -f docker-compose.local.yml exec -T db-local pg_isready -U rsvuser -d rsv_ecosystem_local &>/dev/null; then
        success "✅ Banco de dados está pronto"
        break
    fi
    if [ $i -eq 30 ]; then
        error "❌ Banco de dados não ficou pronto em 30 tentativas"
        exit 1
    fi
    sleep 2
done

# 🚀 Iniciar todos os serviços
log "🚀 Iniciando todos os serviços..."
docker-compose -f docker-compose.local.yml up -d

# ⏳ Aguardar serviços iniciarem
log "⏳ Aguardando serviços iniciarem..."
sleep 15

# 🔍 Verificar saúde dos serviços
log "🔍 Verificando saúde dos serviços..."

services=(
    "ecosystem-master-local:3000"
    "crm-system-local:3001"
    "booking-engine-local:3002"
    "hotel-management-local:3003"
    "analytics-intelligence-local:3004"
    "monitoring-local:9090"
    "grafana-local:3005"
)

all_healthy=true

for service in "${services[@]}"; do
    IFS=':' read -r container port <<< "$service"
    
    log "🔍 Verificando $container na porta $port..."
    
    for i in {1..10}; do
        if curl -f -s "http://localhost:$port/health" &>/dev/null || \
           curl -f -s "http://localhost:$port" &>/dev/null; then
            success "✅ $container está respondendo na porta $port"
            break
        fi
        
        if [ $i -eq 10 ]; then
            warning "⚠️ $container não está respondendo na porta $port"
            all_healthy=false
        fi
        
        sleep 3
    done
done

# 📊 Mostrar status dos containers
log "📊 Status dos containers:"
docker-compose -f docker-compose.local.yml ps

# 🌐 Mostrar URLs de acesso
echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    🌐 URLs DE ACESSO                        ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║                                                              ║"
echo "║  🏠 Ecosystem Master:    http://localhost:3000              ║"
echo "║  👥 CRM System:          http://localhost:3001              ║"
echo "║  🎯 Booking Engine:      http://localhost:3002              ║"
echo "║  🏨 Hotel Management:    http://localhost:3003              ║"
echo "║  📊 Analytics:           http://localhost:3004              ║"
echo "║  📈 Grafana Dashboard:   http://localhost:3005              ║"
echo "║  🔍 Prometheus:          http://localhost:9090              ║"
echo "║                                                              ║"
echo "║  🗄️  Database:           localhost:5432                     ║"
echo "║  🔴 Redis:               localhost:6379                     ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# 📋 Credenciais de acesso
echo -e "${YELLOW}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    🔐 CREDENCIAIS                           ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║                                                              ║"
echo "║  🗄️  Database:                                              ║"
echo "║     Host: localhost                                          ║"
echo "║     Port: 5432                                               ║"
echo "║     Database: rsv_ecosystem_local                            ║"
echo "║     User: rsvuser                                            ║"
echo "║     Password: rsvpassword                                    ║"
echo "║                                                              ║"
echo "║  📈 Grafana:                                                 ║"
echo "║     User: admin                                              ║"
echo "║     Password: rsvadmin2025                                   ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# 🧪 Executar testes básicos
log "🧪 Executando testes básicos de conectividade..."

# Teste de conectividade com banco
if docker-compose -f docker-compose.local.yml exec -T db-local psql -U rsvuser -d rsv_ecosystem_local -c "SELECT 1;" &>/dev/null; then
    success "✅ Conectividade com banco de dados OK"
else
    warning "⚠️ Problema na conectividade com banco de dados"
fi

# Teste de conectividade com Redis
if docker-compose -f docker-compose.local.yml exec -T redis-local redis-cli ping &>/dev/null; then
    success "✅ Conectividade com Redis OK"
else
    warning "⚠️ Problema na conectividade com Redis"
fi

# 📝 Logs de inicialização
log "📝 Logs de inicialização salvos em: ./logs/"

# 🎉 Finalização
if [ "$all_healthy" = true ]; then
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                                                              ║"
    echo "║           🎉 INICIALIZAÇÃO CONCLUÍDA COM SUCESSO!           ║"
    echo "║                                                              ║"
    echo "║        Todos os serviços estão rodando corretamente         ║"
    echo "║                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    log "🚀 Ambiente de produção local está pronto para uso!"
    log "📊 Para monitorar os logs: docker-compose -f docker-compose.local.yml logs -f"
    log "🛑 Para parar os serviços: docker-compose -f docker-compose.local.yml down"
    
else
    echo -e "${YELLOW}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                                                              ║"
    echo "║           ⚠️ INICIALIZAÇÃO CONCLUÍDA COM AVISOS            ║"
    echo "║                                                              ║"
    echo "║        Alguns serviços podem não estar funcionando          ║"
    echo "║                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    warning "⚠️ Verifique os logs dos serviços com problemas"
    log "📊 Para ver logs: docker-compose -f docker-compose.local.yml logs [service-name]"
fi

# 🔄 Comandos úteis
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    🔧 COMANDOS ÚTEIS                        ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║                                                              ║"
echo "║  📊 Ver logs:                                                ║"
echo "║     docker-compose -f docker-compose.local.yml logs -f      ║"
echo "║                                                              ║"
echo "║  🔄 Reiniciar serviço:                                       ║"
echo "║     docker-compose -f docker-compose.local.yml restart [service] ║"
echo "║                                                              ║"
echo "║  🛑 Parar tudo:                                              ║"
echo "║     docker-compose -f docker-compose.local.yml down          ║"
echo "║                                                              ║"
echo "║  🧹 Limpeza completa:                                        ║"
echo "║     docker-compose -f docker-compose.local.yml down -v       ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

exit 0
