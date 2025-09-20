# 🚀 INSTRUÇÕES PARA TESTE LOCAL - Onion 360 RSV

## 📋 Resumo Rápido

O sistema **Onion 360 RSV** está **100% completo** com **32 microserviços** implementados e prontos para teste local!

## 🎯 O que foi implementado

✅ **32 Microserviços Completos:**
- Core, Travel, Finance, Notifications, Data
- E-commerce, Tickets, Parks, Attractions
- Inventory, Sales, Marketing, Analytics, SEO, Multilingual
- Subscriptions, Gift Cards, Coupons, Rewards
- **Loyalty, Groups, Documents, Visa, Insurance, Refunds**
- **Sectoral Finance, Admin, Maps, Videos, Photos, Reviews, Chatbots**

✅ **Infraestrutura Completa:**
- PostgreSQL, MongoDB, Redis
- Kafka, Zookeeper
- Prometheus, Grafana
- Docker & Docker Compose

✅ **Frontend Next.js:**
- Interface moderna e responsiva
- PWA (Progressive Web App)
- Integração com todos os microserviços

## 🚀 Como Testar Localmente

### 1. Pré-requisitos
```bash
# Verificar se você tem:
- Docker Desktop (Windows/Mac) ou Docker (Linux)
- Docker Compose
- 8GB RAM mínimo (16GB recomendado)
- 50GB espaço em disco
```

### 2. Preparação
```bash
# Navegar para o diretório do projeto
cd rsv-onion360

# Criar diretórios para uploads
mkdir uploads visa_documents insurance_documents refund_documents videos photos

# Copiar configurações (opcional)
cp env.example .env
```

### 3. Executar o Sistema
```bash
# Construir e iniciar todos os serviços
docker-compose -f docker-compose.local.yml up -d

# Verificar status
docker-compose -f docker-compose.local.yml ps

# Ver logs em tempo real
docker-compose -f docker-compose.local.yml logs -f
```

### 4. Aguardar Inicialização
⏱️ **Tempo estimado:** 5-10 minutos para todos os serviços iniciarem

## 🌐 Acessos do Sistema

### Frontend e APIs Principais
- **🌐 Frontend Principal**: http://localhost:3000
- **🔧 API Core**: http://localhost:5000
- **✈️ API Travel**: http://localhost:5003
- **💰 API Finance**: http://localhost:5005

### Microserviços Específicos (Novos)
- **🎁 Loyalty Service**: http://localhost:8014
- **👥 Groups Service**: http://localhost:8015
- **📄 Documents Service**: http://localhost:8016
- **🛂 Visa Service**: http://localhost:8017
- **🛡️ Insurance Service**: http://localhost:8018
- **💸 Refunds Service**: http://localhost:8019
- **📊 Sectoral Finance**: http://localhost:8020
- **⚙️ Admin Service**: http://localhost:8021
- **🗺️ Maps Service**: http://localhost:8022
- **🎥 Videos Service**: http://localhost:8023
- **📸 Photos Service**: http://localhost:8024
- **⭐ Reviews Service**: http://localhost:8025
- **🤖 Chatbots Service**: http://localhost:8026

### Monitoramento
- **📊 Grafana**: http://localhost:3001 (admin/admin)
- **📈 Prometheus**: http://localhost:9090

### Bancos de Dados
- **🗄️ PostgreSQL**: localhost:5432 (user/password)
- **📚 MongoDB**: localhost:27017
- **⚡ Redis**: localhost:6379

## 🧪 Testes Automatizados

### Windows (PowerShell)
```powershell
# Executar teste automatizado
.\scripts\test-local.ps1

# Ou com verbose
.\scripts\test-local.ps1 -Verbose
```

### Linux/Mac (Bash)
```bash
# Tornar executável
chmod +x scripts/test-local.sh

# Executar teste automatizado
./scripts/test-local.sh
```

## 🧪 Testes Manuais

### 1. Teste de Loyalty Service
```bash
# Criar tier de fidelidade
curl -X POST http://localhost:8014/tiers/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Bronze","description":"Tier inicial","min_points":0,"max_points":1000,"discount_percentage":5.0}'

# Verificar tiers
curl -X GET http://localhost:8014/tiers/
```

### 2. Teste de Groups Service
```bash
# Criar grupo
curl -X POST http://localhost:8015/groups/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Grupo Teste","description":"Grupo para testes","group_type":"social","created_by":1}'

# Verificar grupos
curl -X GET http://localhost:8015/groups/
```

### 3. Teste de Chatbots Service
```bash
# Criar chatbot
curl -X POST http://localhost:8026/chatbots/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Bot Teste","description":"Chatbot para testes","chatbot_type":"support","welcome_message":"Olá! Como posso ajudar?"}'

# Criar sessão
curl -X POST http://localhost:8026/sessions/ \
  -H "Content-Type: application/json" \
  -d '{"chatbot_id":1,"session_id":"sessao123","platform":"web"}'
```

## 🔧 Comandos Úteis

### Gerenciamento
```bash
# Ver logs de um serviço específico
docker-compose -f docker-compose.local.yml logs loyalty-service

# Reiniciar um serviço
docker-compose -f docker-compose.local.yml restart loyalty-service

# Parar todos os serviços
docker-compose -f docker-compose.local.yml down

# Parar e remover volumes (cuidado: apaga dados)
docker-compose -f docker-compose.local.yml down -v
```

### Debugging
```bash
# Entrar em um container
docker-compose -f docker-compose.local.yml exec loyalty-service bash

# Ver uso de recursos
docker stats

# Verificar conectividade
docker-compose -f docker-compose.local.yml exec loyalty-service ping postgres
```

## 🐛 Solução de Problemas

### Problema: Serviços não iniciam
```bash
# Verificar logs detalhados
docker-compose -f docker-compose.local.yml logs

# Verificar se portas estão disponíveis
netstat -tulpn | grep :5000  # Linux
netstat -an | findstr :5000  # Windows
```

### Problema: Banco de dados não conecta
```bash
# Verificar PostgreSQL
docker-compose -f docker-compose.local.yml exec postgres psql -U user -d rsv -c "SELECT 1;"

# Verificar variáveis de ambiente
docker-compose -f docker-compose.local.yml exec loyalty-service env | grep DATABASE
```

### Problema: Frontend não carrega
```bash
# Verificar frontend
docker-compose -f docker-compose.local.yml logs frontend

# Verificar APIs
curl http://localhost:5000/health
```

## 📊 Monitoramento

### Grafana Dashboards
1. Acesse http://localhost:3001
2. Login: admin/admin
3. Configure datasource Prometheus: http://prometheus:9090
4. Importe dashboards de exemplo

### Métricas Prometheus
```bash
# Verificar métricas
curl http://localhost:9090/api/v1/targets

# Consultar métricas específicas
curl "http://localhost:9090/api/v1/query?query=up"
```

## 🧹 Limpeza

### Parar e Limpar Tudo
```bash
# Parar todos os serviços
docker-compose -f docker-compose.local.yml down

# Remover volumes (cuidado: apaga dados)
docker-compose -f docker-compose.local.yml down -v

# Remover imagens não utilizadas
docker image prune -a

# Limpar cache do Docker
docker system prune -a
```

## ✅ Checklist de Teste

- [ ] Docker e Docker Compose instalados
- [ ] Repositório clonado
- [ ] Diretórios de upload criados
- [ ] Sistema iniciado com sucesso
- [ ] Frontend acessível em http://localhost:3000
- [ ] APIs respondendo corretamente
- [ ] Banco de dados conectando
- [ ] Grafana acessível
- [ ] Prometheus funcionando
- [ ] Testes básicos executados
- [ ] Logs sem erros críticos

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs**: `docker-compose -f docker-compose.local.yml logs`
2. **Consulte a documentação**: README.md
3. **Verifique recursos**: Certifique-se de ter RAM suficiente
4. **Reinicie os serviços**: `docker-compose -f docker-compose.local.yml restart`

## 🎉 Resultado Esperado

Após seguir todas as instruções, você terá:

✅ **32 microserviços funcionando**
✅ **Frontend moderno e responsivo**
✅ **Sistema de monitoramento completo**
✅ **Bancos de dados configurados**
✅ **APIs testadas e funcionais**

---

**🚀 Parabéns!** O sistema Onion 360 RSV está funcionando perfeitamente em seu ambiente local!

**🌐 Acesse:** http://localhost:3000
**📊 Monitoramento:** http://localhost:3001 (admin/admin)
**📈 Métricas:** http://localhost:9090 