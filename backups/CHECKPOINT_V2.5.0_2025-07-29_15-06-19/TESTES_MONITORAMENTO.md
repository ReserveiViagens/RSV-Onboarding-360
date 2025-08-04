# 🧪 Sistema de Testes e Monitoramento - Onion RSV 360

## 📋 Visão Geral

Este documento descreve o sistema completo de testes de carga e monitoramento implementado para o Onion RSV 360, garantindo alta disponibilidade, performance e segurança em ambiente de produção.

## 🏗️ Arquitetura do Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Tests    │    │   Prometheus    │    │     Grafana     │
│   (Locust)      │    │   (Metrics)     │    │   (Dashboards)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  Alertmanager   │
                    │   (Alerts)      │
                    └─────────────────┘
```

## 🧪 Testes de Carga

### **Instalação do Locust**

```bash
pip install locust
```

### **Execução de Testes**

#### **1. Teste Leve (Desenvolvimento)**
```bash
python tests/run_tests.py --load-test light --duration 2m
```

#### **2. Teste Médio (Staging)**
```bash
python tests/run_tests.py --load-test medium --duration 5m
```

#### **3. Teste Pesado (Produção)**
```bash
python tests/run_tests.py --load-test heavy --duration 10m
```

#### **4. Teste de Estresse**
```bash
python tests/run_tests.py --load-test stress --duration 15m
```

### **Execução Manual com Interface Web**

```bash
locust -f tests/load_test.py --host http://localhost:8000
```

Acesse: http://localhost:8089

### **Tipos de Usuários Simulados**

1. **OnionRSVUser**: Usuário geral do sistema
2. **GiftCardUser**: Usuário específico para gift cards
3. **NotificationUser**: Usuário para testes de notificações
4. **DatabaseUser**: Usuário para testes de banco de dados

## 🔍 Testes Automatizados

### **Executar Todos os Testes**

```bash
python tests/run_tests.py --all
```

### **Testes Específicos**

```bash
# Testes de API
python tests/run_tests.py --api

# Testes de Segurança
python tests/run_tests.py --security

# Testes de Performance
python tests/run_tests.py --performance

# Testes de Monitoramento
python tests/run_tests.py --monitoring
```

### **Configuração de Ambiente**

```bash
export TEST_BASE_URL=http://localhost:8000
python tests/run_tests.py
```

## 📊 Sistema de Monitoramento

### **Iniciar Stack de Monitoramento**

```bash
docker-compose -f docker-compose.monitoring.yml up -d
```

### **Acessos**

| Serviço | URL | Credenciais |
|---------|-----|-------------|
| **Prometheus** | http://localhost:9090 | - |
| **Grafana** | http://localhost:3001 | admin/admin123 |
| **Alertmanager** | http://localhost:9093 | - |
| **Kibana** | http://localhost:5601 | - |
| **Jaeger** | http://localhost:16686 | - |
| **cAdvisor** | http://localhost:8080 | - |

### **Métricas Coletadas**

#### **HTTP Metrics**
- `http_requests_total`: Total de requisições
- `http_request_duration_seconds`: Duração das requisições
- `http_request_size_bytes`: Tamanho das requisições
- `http_response_size_bytes`: Tamanho das respostas

#### **Business Metrics**
- `auth_failures_total`: Falhas de autenticação
- `rate_limit_exceeded_total`: Excedentes de rate limit
- `notifications_sent_total`: Notificações enviadas
- `websocket_connections_total`: Conexões WebSocket
- `gift_cards_created_total`: Gift cards criados
- `bookings_created_total`: Reservas criadas
- `payments_processed_total`: Pagamentos processados

#### **System Metrics**
- `system_cpu_usage_percent`: Uso de CPU
- `system_memory_usage_bytes`: Uso de memória
- `system_disk_usage_percent`: Uso de disco

#### **Database Metrics**
- `db_connections_total`: Conexões de banco
- `db_query_duration_seconds`: Duração de queries
- `db_errors_total`: Erros de banco

#### **Cache Metrics**
- `cache_hits_total`: Hits no cache
- `cache_misses_total`: Misses no cache
- `cache_requests_total`: Requisições ao cache

## 🚨 Alertas Configurados

### **Alertas Críticos**
- **ServiceDown**: Serviço não responde
- **HighErrorRate**: Taxa de erro > 5%
- **DiskSpaceFull**: Disco < 10% livre
- **AuthenticationFailures**: > 10 falhas/min
- **BackupFailed**: Backup não realizado em 24h

### **Alertas de Aviso**
- **HighLatency**: Latência > 1s (95%)
- **HighCPUUsage**: CPU > 80%
- **HighMemoryUsage**: Memória > 85%
- **DatabaseConnectionsHigh**: > 80 conexões
- **WebSocketDisconnected**: WebSocket down
- **KafkaQueueHigh**: > 1000 mensagens na fila
- **RateLimitExceeded**: > 5 excedentes/min

### **Alertas de Segurança**
- **SSLCertificateExpiring**: Certificado expira em < 30 dias
- **FrontendSlowResponse**: Frontend > 3s
- **JavaScriptErrors**: > 5 erros/min

## 📈 Dashboards Grafana

### **Dashboard Principal**
- Visão geral de todos os serviços
- Métricas de performance
- Status de saúde

### **Dashboard de Negócio**
- Gift cards criados/utilizados
- Reservas e pagamentos
- Notificações enviadas

### **Dashboard de Infraestrutura**
- CPU, memória, disco
- Conexões de banco
- Cache performance

### **Dashboard de Segurança**
- Falhas de autenticação
- Rate limiting
- Erros de JavaScript

## 🔧 Configuração Avançada

### **Prometheus Configuration**

```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "rules/*.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
```

### **Alert Rules**

```yaml
# monitoring/rules/alerts.yml
groups:
  - name: onion-rsv-alerts
    rules:
      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
```

### **Grafana Dashboards**

Importar dashboards JSON em:
```
monitoring/grafana/dashboards/
```

## 📋 Checklist de Produção

### **Antes do Deploy**
- [ ] Executar testes de carga pesada
- [ ] Verificar métricas de baseline
- [ ] Configurar alertas críticos
- [ ] Testar backup e restore
- [ ] Validar SSL certificates

### **Durante o Deploy**
- [ ] Monitorar métricas em tempo real
- [ ] Verificar alertas
- [ ] Testar endpoints críticos
- [ ] Validar performance

### **Pós-Deploy**
- [ ] Analisar relatórios de teste
- [ ] Ajustar thresholds de alerta
- [ ] Otimizar configurações
- [ ] Documentar mudanças

## 🛠️ Troubleshooting

### **Problemas Comuns**

#### **1. Prometheus não coleta métricas**
```bash
# Verificar conectividade
curl http://localhost:8000/metrics

# Verificar logs
docker logs onion-rsv-prometheus
```

#### **2. Grafana não conecta ao Prometheus**
```bash
# Verificar configuração de datasource
# URL: http://prometheus:9090
```

#### **3. Alertas não disparando**
```bash
# Verificar regras
curl http://localhost:9090/api/v1/rules

# Verificar alertmanager
curl http://localhost:9093/api/v1/alerts
```

#### **4. Testes de carga falhando**
```bash
# Verificar conectividade
curl http://localhost:8000/health

# Verificar logs do serviço
docker logs onion-rsv-core
```

### **Logs Importantes**

```bash
# Prometheus
docker logs onion-rsv-prometheus

# Grafana
docker logs onion-rsv-grafana

# Alertmanager
docker logs onion-rsv-alertmanager

# Core Service
docker logs onion-rsv-core
```

## 📊 Métricas de Sucesso

### **Performance Targets**
- **Latência**: < 500ms (95%)
- **Throughput**: > 1000 req/s
- **Error Rate**: < 1%
- **Uptime**: > 99.9%

### **Business Metrics**
- **Gift Cards**: 100% disponibilidade
- **Notifications**: < 100ms delivery
- **Payments**: < 2s processing
- **Bookings**: < 1s confirmation

## 🔄 Manutenção

### **Backup de Dados**
```bash
# Prometheus
docker exec onion-rsv-prometheus tar -czf /prometheus_backup.tar.gz /prometheus

# Grafana
docker exec onion-rsv-grafana tar -czf /grafana_backup.tar.gz /var/lib/grafana
```

### **Limpeza de Dados**
```bash
# Limpar métricas antigas (Prometheus)
# Configurar retention em prometheus.yml
```

### **Atualizações**
```bash
# Atualizar stack
docker-compose -f docker-compose.monitoring.yml pull
docker-compose -f docker-compose.monitoring.yml up -d
```

## 📞 Suporte

Para problemas ou dúvidas sobre o sistema de testes e monitoramento:

1. Verificar logs dos serviços
2. Consultar documentação do Prometheus/Grafana
3. Analisar métricas e alertas
4. Executar testes de diagnóstico

---

**Sistema de Testes e Monitoramento - Onion RSV 360 v2.1.0**
*Implementado com Prometheus, Grafana, Locust e métricas customizadas* 