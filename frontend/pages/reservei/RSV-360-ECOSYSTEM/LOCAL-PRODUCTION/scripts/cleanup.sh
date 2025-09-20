#!/bin/bash

# 🧹 SCRIPT DE LIMPEZA COMPLETA
# RSV 360° ECOSYSTEM - Limpeza do Ambiente Local

set -e

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

# 🏗️ Banner
echo -e "${PURPLE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║           🧹 RSV 360° ECOSYSTEM - LIMPEZA COMPLETA          ║"
echo "║                                                              ║"
echo "║              Limpeza do Ambiente Local                       ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# ⚠️ Confirmação de segurança
echo -e "${YELLOW}⚠️  ATENÇÃO: Esta operação irá remover TODOS os dados do ambiente local!${NC}"
echo -e "${YELLOW}   Isso inclui:${NC}"
echo -e "${YELLOW}   - Todos os containers${NC}"
echo -e "${YELLOW}   - Todos os volumes de dados${NC}"
echo -e "${YELLOW}   - Todas as imagens Docker${NC}"
echo -e "${YELLOW}   - Todos os logs${NC}"
echo ""
read -p "Tem certeza que deseja continuar? (digite 'SIM' para confirmar): " confirmation

if [ "$confirmation" != "SIM" ]; then
    info "Operação cancelada pelo usuário"
    exit 0
fi

# 🛑 Parar todos os serviços
log "🛑 Parando todos os serviços..."
if [ -f "docker-compose.local.yml" ]; then
    docker-compose -f docker-compose.local.yml down --volumes --remove-orphans 2>/dev/null || true
    success "✅ Serviços parados"
else
    warning "⚠️ Arquivo docker-compose.local.yml não encontrado"
fi

# 🗑️ Remover containers específicos
log "🗑️ Removendo containers específicos..."
containers=(
    "rsv-ecosystem-master-local"
    "rsv-crm-system-local"
    "rsv-booking-engine-local"
    "rsv-hotel-management-local"
    "rsv-analytics-intelligence-local"
    "rsv-db-local"
    "rsv-redis-local"
    "rsv-monitoring-local"
    "rsv-grafana-local"
)

for container in "${containers[@]}"; do
    if docker ps -a --format "table {{.Names}}" | grep -q "$container"; then
        log "🗑️ Removendo container: $container"
        docker rm -f "$container" 2>/dev/null || true
    fi
done

# 🗑️ Remover volumes específicos
log "🗑️ Removendo volumes específicos..."
volumes=(
    "rsv-360-ecosystem_db_local_data"
    "rsv-360-ecosystem_redis_local_data"
    "rsv-360-ecosystem_prometheus_local_data"
    "rsv-360-ecosystem_grafana_local_data"
)

for volume in "${volumes[@]}"; do
    if docker volume ls --format "table {{.Name}}" | grep -q "$volume"; then
        log "🗑️ Removendo volume: $volume"
        docker volume rm "$volume" 2>/dev/null || true
    fi
done

# 🗑️ Remover imagens específicas
log "🗑️ Removendo imagens específicas..."
images=(
    "rsv-360-ecosystem_ecosystem-master-local"
    "rsv-360-ecosystem_crm-system-local"
    "rsv-360-ecosystem_booking-engine-local"
    "rsv-360-ecosystem_hotel-management-local"
    "rsv-360-ecosystem_analytics-intelligence-local"
)

for image in "${images[@]}"; do
    if docker images --format "table {{.Repository}}" | grep -q "$image"; then
        log "🗑️ Removendo imagem: $image"
        docker rmi -f "$image" 2>/dev/null || true
    fi
done

# 🧹 Limpeza geral do Docker
log "🧹 Executando limpeza geral do Docker..."

# Remover containers parados
log "🗑️ Removendo containers parados..."
docker container prune -f 2>/dev/null || true

# Remover volumes não utilizados
log "🗑️ Removendo volumes não utilizados..."
docker volume prune -f 2>/dev/null || true

# Remover redes não utilizadas
log "🗑️ Removendo redes não utilizadas..."
docker network prune -f 2>/dev/null || true

# Remover imagens não utilizadas
log "🗑️ Removendo imagens não utilizadas..."
docker image prune -a -f 2>/dev/null || true

# Remover cache de build
log "🗑️ Removendo cache de build..."
docker builder prune -a -f 2>/dev/null || true

# 🗑️ Limpar logs locais
log "🗑️ Limpando logs locais..."
if [ -d "./logs" ]; then
    rm -rf ./logs/* 2>/dev/null || true
    success "✅ Logs locais removidos"
else
    info "📁 Diretório de logs não encontrado"
fi

# 🗑️ Limpar arquivos temporários
log "🗑️ Limpando arquivos temporários..."
if [ -d "./temp" ]; then
    rm -rf ./temp/* 2>/dev/null || true
    success "✅ Arquivos temporários removidos"
fi

# 🗑️ Limpar cache do npm (se existir)
log "🗑️ Limpando cache do npm..."
if command -v npm &> /dev/null; then
    npm cache clean --force 2>/dev/null || true
    success "✅ Cache do npm limpo"
fi

# 🗑️ Limpar cache do Docker
log "🗑️ Limpando cache do Docker..."
docker system prune -a -f --volumes 2>/dev/null || true
success "✅ Cache do Docker limpo"

# 📊 Verificar espaço liberado
log "📊 Verificando espaço liberado..."
if command -v df &> /dev/null; then
    disk_usage=$(df -h . | tail -1 | awk '{print $4}')
    info "💾 Espaço disponível: $disk_usage"
fi

# 🔍 Verificar se ainda há containers rodando
log "🔍 Verificando containers restantes..."
remaining_containers=$(docker ps -a --format "table {{.Names}}" | grep -c "rsv-" || echo "0")
if [ "$remaining_containers" -gt 0 ]; then
    warning "⚠️ Ainda há $remaining_containers containers RSV rodando"
    docker ps -a --format "table {{.Names}}\t{{.Status}}" | grep "rsv-"
else
    success "✅ Nenhum container RSV restante"
fi

# 🔍 Verificar se ainda há volumes
log "🔍 Verificando volumes restantes..."
remaining_volumes=$(docker volume ls --format "table {{.Name}}" | grep -c "rsv-" || echo "0")
if [ "$remaining_volumes" -gt 0 ]; then
    warning "⚠️ Ainda há $remaining_volumes volumes RSV"
    docker volume ls --format "table {{.Name}}" | grep "rsv-"
else
    success "✅ Nenhum volume RSV restante"
fi

# 🔍 Verificar se ainda há imagens
log "🔍 Verificando imagens restantes..."
remaining_images=$(docker images --format "table {{.Repository}}" | grep -c "rsv-" || echo "0")
if [ "$remaining_images" -gt 0 ]; then
    warning "⚠️ Ainda há $remaining_images imagens RSV"
    docker images --format "table {{.Repository}}\t{{.Tag}}" | grep "rsv-"
else
    success "✅ Nenhuma imagem RSV restante"
fi

# 📋 Relatório final
echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    📋 RELATÓRIO DE LIMPEZA                  ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║                                                              ║"
echo "║  ✅ Containers parados e removidos                          ║"
echo "║  ✅ Volumes de dados removidos                              ║"
echo "║  ✅ Imagens Docker removidas                                ║"
echo "║  ✅ Logs locais limpos                                      ║"
echo "║  ✅ Cache do sistema limpo                                  ║"
echo "║  ✅ Arquivos temporários removidos                          ║"
echo "║                                                              ║"
echo "║  🎉 LIMPEZA COMPLETA REALIZADA COM SUCESSO!                 ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# 🚀 Próximos passos
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    🚀 PRÓXIMOS PASSOS                      ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║                                                              ║"
echo "║  Para reiniciar o ambiente:                                 ║"
echo "║     ./scripts/start-local-production.sh                     ║"
echo "║                                                              ║"
echo "║  Para verificar a saúde:                                    ║"
echo "║     ./scripts/health-check.sh                               ║"
echo "║                                                              ║"
echo "║  Para desenvolvimento:                                      ║"
echo "║     cd ../ECOSYSTEM-MASTER && npm run dev                   ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

log "🎉 Limpeza completa finalizada!"
log "💡 O ambiente está pronto para uma nova inicialização"

exit 0
