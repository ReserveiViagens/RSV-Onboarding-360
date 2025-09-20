#!/bin/bash

# 🧪 Script de Teste Automatizado - Onion 360 RSV
# Este script testa todos os microserviços do sistema

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Configurações
BASE_URL="http://localhost"
TIMEOUT=30
MAX_RETRIES=3

# Lista de serviços para testar
SERVICES=(
    "5000:Core Service"
    "5002:Notifications Service"
    "5003:Travel Service"
    "5004:Data Service"
    "5005:Finance Service"
    "5006:Tickets Service"
    "5007:E-commerce Service"
    "5008:Parks Service"
    "5009:Attractions Service"
    "5012:Inventory Service"
    "5013:Sales Service"
    "5014:Marketing Service"
    "8007:Analytics Service"
    "8008:SEO Service"
    "8009:Multilingual Service"
    "8010:Subscriptions Service"
    "8011:Gift Cards Service"
    "8012:Coupons Service"
    "8013:Rewards Service"
    "8014:Loyalty Service"
    "8015:Groups Service"
    "8016:Documents Service"
    "8017:Visa Service"
    "8018:Insurance Service"
    "8019:Refunds Service"
    "8020:Sectoral Finance Service"
    "8021:Admin Service"
    "8022:Maps Service"
    "8023:Videos Service"
    "8024:Photos Service"
    "8025:Reviews Service"
    "8026:Chatbots Service"
)

# Função para testar um serviço
test_service() {
    local port=$1
    local name=$2
    local url="$BASE_URL:$port/health"
    
    log "Testando $name ($url)"
    
    for i in $(seq 1 $MAX_RETRIES); do
        if curl -s --max-time $TIMEOUT "$url" > /dev/null 2>&1; then
            log "✅ $name está funcionando"
            return 0
        else
            if [ $i -eq $MAX_RETRIES ]; then
                error "❌ $name não está respondendo após $MAX_RETRIES tentativas"
                return 1
            else
                warn "Tentativa $i/$MAX_RETRIES falhou para $name, tentando novamente..."
                sleep 2
            fi
        fi
    done
}

# Função para testar banco de dados
test_database() {
    log "Testando conexão com PostgreSQL..."
    
    if docker-compose -f docker-compose.local.yml exec -T postgres psql -U user -d rsv -c "SELECT 1;" > /dev/null 2>&1; then
        log "✅ PostgreSQL está funcionando"
        return 0
    else
        error "❌ PostgreSQL não está respondendo"
        return 1
    fi
}

# Função para testar Redis
test_redis() {
    log "Testando conexão com Redis..."
    
    if docker-compose -f docker-compose.local.yml exec -T redis redis-cli ping > /dev/null 2>&1; then
        log "✅ Redis está funcionando"
        return 0
    else
        error "❌ Redis não está respondendo"
        return 1
    fi
}

# Função para testar frontend
test_frontend() {
    log "Testando Frontend..."
    
    if curl -s --max-time $TIMEOUT "$BASE_URL:3000" > /dev/null 2>&1; then
        log "✅ Frontend está funcionando"
        return 0
    else
        error "❌ Frontend não está respondendo"
        return 1
    fi
}

# Função para testar monitoramento
test_monitoring() {
    log "Testando serviços de monitoramento..."
    
    # Testar Prometheus
    if curl -s --max-time $TIMEOUT "$BASE_URL:9090/api/v1/targets" > /dev/null 2>&1; then
        log "✅ Prometheus está funcionando"
    else
        warn "⚠️ Prometheus não está respondendo"
    fi
    
    # Testar Grafana
    if curl -s --max-time $TIMEOUT "$BASE_URL:3001" > /dev/null 2>&1; then
        log "✅ Grafana está funcionando"
    else
        warn "⚠️ Grafana não está respondendo"
    fi
}

# Função para testar APIs específicas
test_specific_apis() {
    log "Testando APIs específicas..."
    
    # Testar criação de tier de fidelidade
    if curl -s -X POST "$BASE_URL:8014/tiers/" \
        -H "Content-Type: application/json" \
        -d '{"name":"Test Tier","description":"Tier para teste","min_points":0,"max_points":1000,"discount_percentage":5.0}' > /dev/null 2>&1; then
        log "✅ API de Loyalty Service está funcionando"
    else
        warn "⚠️ API de Loyalty Service não está respondendo"
    fi
    
    # Testar criação de grupo
    if curl -s -X POST "$BASE_URL:8015/groups/" \
        -H "Content-Type: application/json" \
        -d '{"name":"Test Group","description":"Grupo para teste","group_type":"social","created_by":1}' > /dev/null 2>&1; then
        log "✅ API de Groups Service está funcionando"
    else
        warn "⚠️ API de Groups Service não está respondendo"
    fi
    
    # Testar criação de chatbot
    if curl -s -X POST "$BASE_URL:8026/chatbots/" \
        -H "Content-Type: application/json" \
        -d '{"name":"Test Bot","description":"Bot para teste","chatbot_type":"support","welcome_message":"Olá!"}' > /dev/null 2>&1; then
        log "✅ API de Chatbots Service está funcionando"
    else
        warn "⚠️ API de Chatbots Service não está respondendo"
    fi
}

# Função para verificar recursos do sistema
check_system_resources() {
    log "Verificando recursos do sistema..."
    
    # Verificar uso de memória
    local mem_usage=$(docker stats --no-stream --format "table {{.MemUsage}}" | tail -n +2 | head -1)
    log "Uso de memória atual: $mem_usage"
    
    # Verificar uso de CPU
    local cpu_usage=$(docker stats --no-stream --format "table {{.CPUPerc}}" | tail -n +2 | head -1)
    log "Uso de CPU atual: $cpu_usage"
    
    # Verificar containers rodando
    local running_containers=$(docker ps --format "{{.Names}}" | wc -l)
    log "Containers rodando: $running_containers"
}

# Função principal
main() {
    log "🚀 Iniciando testes do sistema Onion 360 RSV"
    log "=========================================="
    
    # Verificar se Docker está rodando
    if ! docker info > /dev/null 2>&1; then
        error "Docker não está rodando. Inicie o Docker primeiro."
        exit 1
    fi
    
    # Verificar se os serviços estão rodando
    if ! docker-compose -f docker-compose.local.yml ps | grep -q "Up"; then
        error "Serviços não estão rodando. Execute 'docker-compose -f docker-compose.local.yml up -d' primeiro."
        exit 1
    fi
    
    info "Aguardando inicialização dos serviços..."
    sleep 10
    
    # Contadores
    local total_services=${#SERVICES[@]}
    local passed_services=0
    local failed_services=0
    
    # Testar cada serviço
    for service in "${SERVICES[@]}"; do
        IFS=':' read -r port name <<< "$service"
        if test_service "$port" "$name"; then
            ((passed_services++))
        else
            ((failed_services++))
        fi
    done
    
    # Testar infraestrutura
    log "=========================================="
    log "Testando infraestrutura..."
    
    test_database
    test_redis
    test_frontend
    test_monitoring
    
    # Testar APIs específicas
    log "=========================================="
    test_specific_apis
    
    # Verificar recursos
    log "=========================================="
    check_system_resources
    
    # Resumo final
    log "=========================================="
    log "📊 RESUMO DOS TESTES"
    log "=========================================="
    log "Total de serviços testados: $total_services"
    log "✅ Serviços funcionando: $passed_services"
    log "❌ Serviços com problemas: $failed_services"
    
    if [ $failed_services -eq 0 ]; then
        log "🎉 TODOS OS SERVIÇOS ESTÃO FUNCIONANDO PERFEITAMENTE!"
        log "🌐 Acesse o sistema em: http://localhost:3000"
        log "📊 Monitoramento: http://localhost:3001 (admin/admin)"
        log "📈 Métricas: http://localhost:9090"
    else
        warn "⚠️ Alguns serviços apresentaram problemas. Verifique os logs acima."
        log "Para ver logs detalhados: docker-compose -f docker-compose.local.yml logs"
    fi
    
    log "=========================================="
    log "✅ Teste concluído!"
}

# Executar função principal
main "$@" 