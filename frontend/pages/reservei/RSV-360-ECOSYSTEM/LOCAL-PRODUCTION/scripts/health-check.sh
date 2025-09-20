#!/bin/bash

# 🔍 SCRIPT DE VERIFICAÇÃO DE SAÚDE
# RSV 360° ECOSYSTEM - Health Check Completo

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
echo "║           🔍 RSV 360° ECOSYSTEM - HEALTH CHECK              ║"
echo "║                                                              ║"
echo "║              Verificação Completa de Saúde                  ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# 📊 Contadores
total_checks=0
passed_checks=0
failed_checks=0

# 🔍 Função para verificar serviço
check_service() {
    local service_name=$1
    local url=$2
    local expected_status=${3:-200}
    
    total_checks=$((total_checks + 1))
    
    log "🔍 Verificando $service_name..."
    
    if response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null); then
        if [ "$response" = "$expected_status" ]; then
            success "✅ $service_name está funcionando (HTTP $response)"
            passed_checks=$((passed_checks + 1))
            return 0
        else
            warning "⚠️ $service_name retornou HTTP $response (esperado: $expected_status)"
            failed_checks=$((failed_checks + 1))
            return 1
        fi
    else
        error "❌ $service_name não está respondendo"
        failed_checks=$((failed_checks + 1))
        return 1
    fi
}

# 🗄️ Função para verificar banco de dados
check_database() {
    total_checks=$((total_checks + 1))
    
    log "🗄️ Verificando banco de dados..."
    
    if docker-compose -f docker-compose.local.yml exec -T db-local pg_isready -U rsvuser -d rsv_ecosystem_local &>/dev/null; then
        success "✅ Banco de dados está acessível"
        passed_checks=$((passed_checks + 1))
        
        # Verificar se as tabelas existem
        if docker-compose -f docker-compose.local.yml exec -T db-local psql -U rsvuser -d rsv_ecosystem_local -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" &>/dev/null; then
            success "✅ Estrutura do banco de dados está OK"
        else
            warning "⚠️ Problema na estrutura do banco de dados"
        fi
    else
        error "❌ Banco de dados não está acessível"
        failed_checks=$((failed_checks + 1))
    fi
}

# 🔴 Função para verificar Redis
check_redis() {
    total_checks=$((total_checks + 1))
    
    log "🔴 Verificando Redis..."
    
    if docker-compose -f docker-compose.local.yml exec -T redis-local redis-cli ping &>/dev/null; then
        success "✅ Redis está funcionando"
        passed_checks=$((passed_checks + 1))
    else
        error "❌ Redis não está respondendo"
        failed_checks=$((failed_checks + 1))
    fi
}

# 📊 Função para verificar containers
check_containers() {
    log "📊 Verificando status dos containers..."
    
    # Listar containers em execução
    echo -e "${CYAN}Containers em execução:${NC}"
    docker-compose -f docker-compose.local.yml ps
    
    # Verificar se todos os containers estão rodando
    local containers=(
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
        total_checks=$((total_checks + 1))
        
        if docker ps --format "table {{.Names}}" | grep -q "$container"; then
            if docker ps --format "table {{.Status}}" | grep -q "Up"; then
                success "✅ Container $container está rodando"
                passed_checks=$((passed_checks + 1))
            else
                warning "⚠️ Container $container está parado"
                failed_checks=$((failed_checks + 1))
            fi
        else
            error "❌ Container $container não encontrado"
            failed_checks=$((failed_checks + 1))
        fi
    done
}

# 🌐 Verificar serviços web
log "🌐 Verificando serviços web..."

# Lista de serviços para verificar
services=(
    "Ecosystem Master:http://localhost:3000/health:200"
    "CRM System:http://localhost:3001/health:200"
    "Booking Engine:http://localhost:3002/health:200"
    "Hotel Management:http://localhost:3003/health:200"
    "Analytics Intelligence:http://localhost:3004/health:200"
    "Grafana Dashboard:http://localhost:3005:200"
    "Prometheus:http://localhost:9090:200"
)

for service_info in "${services[@]}"; do
    IFS=':' read -r name url expected <<< "$service_info"
    check_service "$name" "$url" "$expected"
done

# 🗄️ Verificar banco de dados
check_database

# 🔴 Verificar Redis
check_redis

# 📊 Verificar containers
check_containers

# 📈 Verificar recursos do sistema
log "📈 Verificando recursos do sistema..."

# Verificar uso de CPU
cpu_usage=$(docker stats --no-stream --format "table {{.CPUPerc}}" | tail -n +2 | head -1 | sed 's/%//')
if (( $(echo "$cpu_usage < 80" | bc -l) )); then
    success "✅ Uso de CPU está normal ($cpu_usage%)"
else
    warning "⚠️ Uso de CPU está alto ($cpu_usage%)"
fi

# Verificar uso de memória
memory_usage=$(docker stats --no-stream --format "table {{.MemUsage}}" | tail -n +2 | head -1)
info "📊 Uso de memória: $memory_usage"

# Verificar espaço em disco
disk_usage=$(df -h . | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$disk_usage" -lt 80 ]; then
    success "✅ Espaço em disco está OK ($disk_usage% usado)"
else
    warning "⚠️ Espaço em disco está baixo ($disk_usage% usado)"
fi

# 📊 Relatório final
echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    📊 RELATÓRIO FINAL                       ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║                                                              ║"
echo "║  Total de verificações: $total_checks                                    ║"
echo "║  ✅ Passou: $passed_checks                                           ║"
echo "║  ❌ Falhou: $failed_checks                                           ║"
echo "║                                                              ║"

# Calcular porcentagem de sucesso
if [ $total_checks -gt 0 ]; then
    success_rate=$((passed_checks * 100 / total_checks))
    echo "║  📈 Taxa de sucesso: $success_rate%                                      ║"
    
    if [ $success_rate -ge 90 ]; then
        echo "║  🎉 Status: EXCELENTE                                      ║"
    elif [ $success_rate -ge 70 ]; then
        echo "║  ✅ Status: BOM                                            ║"
    elif [ $success_rate -ge 50 ]; then
        echo "║  ⚠️  Status: ATENÇÃO NECESSÁRIA                            ║"
    else
        echo "║  ❌ Status: CRÍTICO                                        ║"
    fi
else
    echo "║  ❌ Nenhuma verificação foi executada                        ║"
fi

echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# 🔧 Sugestões de correção
if [ $failed_checks -gt 0 ]; then
    echo -e "${YELLOW}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    🔧 SUGESTÕES DE CORREÇÃO                ║"
    echo "╠══════════════════════════════════════════════════════════════╣"
    echo "║                                                              ║"
    echo "║  1. Verificar logs dos serviços com problemas:              ║"
    echo "║     docker-compose -f docker-compose.local.yml logs [service] ║"
    echo "║                                                              ║"
    echo "║  2. Reiniciar serviços com problemas:                       ║"
    echo "║     docker-compose -f docker-compose.local.yml restart [service] ║"
    echo "║                                                              ║"
    echo "║  3. Verificar se todas as portas estão livres:              ║"
    echo "║     netstat -tulpn | grep :3000                             ║"
    echo "║                                                              ║"
    echo "║  4. Limpar e reconstruir containers:                        ║"
    echo "║     docker-compose -f docker-compose.local.yml down -v      ║"
    echo "║     docker-compose -f docker-compose.local.yml up -d --build ║"
    echo "║                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
fi

# 🚀 Comandos úteis
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    🚀 COMANDOS ÚTEIS                       ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║                                                              ║"
echo "║  📊 Ver logs em tempo real:                                  ║"
echo "║     docker-compose -f docker-compose.local.yml logs -f      ║"
echo "║                                                              ║"
echo "║  🔄 Reiniciar todos os serviços:                             ║"
echo "║     docker-compose -f docker-compose.local.yml restart      ║"
echo "║                                                              ║"
echo "║  🛑 Parar todos os serviços:                                 ║"
echo "║     docker-compose -f docker-compose.local.yml down         ║"
echo "║                                                              ║"
echo "║  🧹 Limpeza completa:                                        ║"
echo "║     docker-compose -f docker-compose.local.yml down -v       ║"
echo "║     docker system prune -a -f                                ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Código de saída baseado no resultado
if [ $failed_checks -eq 0 ]; then
    log "🎉 Todos os serviços estão funcionando perfeitamente!"
    exit 0
elif [ $failed_checks -le 2 ]; then
    warning "⚠️ Alguns serviços têm problemas menores"
    exit 1
else
    error "❌ Muitos serviços têm problemas críticos"
    exit 2
fi
