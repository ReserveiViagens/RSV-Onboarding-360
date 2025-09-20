# 🧪 Guia de Teste Local - Onion 360 RSV

Este guia te ajudará a testar o sistema Onion 360 RSV completo localmente.

## 📋 Pré-requisitos

### Software Necessário
- **Docker**: Versão 20.10+
- **Docker Compose**: Versão 2.0+
- **Git**: Para clonar o repositório
- **8GB RAM mínimo** (recomendado 16GB)
- **50GB espaço em disco**

### Verificação do Ambiente
```bash
# Verificar versões
docker --version
docker-compose --version
git --version

# Verificar se Docker está rodando
docker info
```

## 🚀 Passo a Passo para Teste Local

### 1. Clone e Preparação
```bash
# Clone o repositório
git clone <repository-url>
cd rsv-onion360

# Criar diretórios para uploads
mkdir -p uploads visa_documents insurance_documents refund_documents videos photos
```

### 2. Configuração de Ambiente
```bash
# Criar arquivo .env (se não existir)
cp .env.example .env

# Editar variáveis de ambiente (opcional)
# As configurações padrão já estão funcionais para teste local
```

### 3. Executar o Sistema
```bash
# Construir e iniciar todos os serviços
docker-compose -f docker-compose.local.yml up -d

# Verificar status dos serviços
docker-compose -f docker-compose.local.yml ps

# Ver logs em tempo real
docker-compose -f docker-compose.local.yml logs -f
```

### 4. Aguardar Inicialização
O sistema levará alguns minutos para inicializar completamente. Aguarde até que todos os serviços estejam com status "Up".

## 🌐 Acessos do Sistema

### Frontend e APIs
- **Frontend Principal**: http://localhost:3000
- **API Core**: http://localhost:5000
- **API Travel**: http://localhost:5003
- **API Finance**: http://localhost:5005
- **API Notifications**: http://localhost:5002

### Microserviços Específicos
- **Loyalty Service**: http://localhost:8014
- **Groups Service**: http://localhost:8015
- **Documents Service**: http://localhost:8016
- **Visa Service**: http://localhost:8017
- **Insurance Service**: http://localhost:8018
- **Refunds Service**: http://localhost:8019
- **Sectoral Finance**: http://localhost:8020
- **Admin Service**: http://localhost:8021
- **Maps Service**: http://localhost:8022
- **Videos Service**: http://localhost:8023
- **Photos Service**: http://localhost:8024
- **Reviews Service**: http://localhost:8025
- **Chatbots Service**: http://localhost:8026

### Monitoramento
- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090

### Bancos de Dados
- **PostgreSQL**: localhost:5432 (user/password)
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

## 🧪 Testes por Funcionalidade

### 1. Teste de Autenticação
```bash
# Testar Core Service
curl -X GET http://localhost:5000/health

# Testar criação de usuário
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","full_name":"Usuário Teste","password":"senha123"}'
```

### 2. Teste de Loyalty Service
```bash
# Criar tier de fidelidade
curl -X POST http://localhost:8014/tiers/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Bronze","description":"Tier inicial","min_points":0,"max_points":1000,"discount_percentage":5.0}'

# Verificar tiers
curl -X GET http://localhost:8014/tiers/
```

### 3. Teste de Groups Service
```bash
# Criar grupo
curl -X POST http://localhost:8015/groups/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Grupo Teste","description":"Grupo para testes","group_type":"social","created_by":1}'

# Verificar grupos
curl -X GET http://localhost:8015/groups/
```

### 4. Teste de Documents Service
```bash
# Upload de documento (simulado)
curl -X POST http://localhost:8016/documents/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Documento Teste","file_name":"teste.pdf","file_path":"/uploads/teste.pdf","file_size":1024,"file_type":"pdf","mime_type":"application/pdf","document_type":"contract","uploaded_by":1}'
```

### 5. Teste de Chatbots Service
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

## 📊 Testes de Monitoramento

### 1. Verificar Métricas Prometheus
```bash
# Acessar métricas do sistema
curl http://localhost:9090/api/v1/targets

# Verificar métricas específicas
curl "http://localhost:9090/api/v1/query?query=up"
```

### 2. Dashboard Grafana
1. Acesse http://localhost:3001
2. Login: admin/admin
3. Configure datasource Prometheus: http://prometheus:9090
4. Importe dashboards de exemplo

## 🔧 Comandos Úteis

### Gerenciamento de Containers
```bash
# Ver logs de um serviço específico
docker-compose -f docker-compose.local.yml logs core-service

# Reiniciar um serviço
docker-compose -f docker-compose.local.yml restart loyalty-service

# Parar todos os serviços
docker-compose -f docker-compose.local.yml down

# Parar e remover volumes
docker-compose -f docker-compose.local.yml down -v
```

### Debugging
```bash
# Entrar em um container
docker-compose -f docker-compose.local.yml exec core-service bash

# Ver uso de recursos
docker stats

# Verificar conectividade entre serviços
docker-compose -f docker-compose.local.yml exec core-service ping postgres
```

## 🐛 Solução de Problemas

### Problema: Serviços não iniciam
```bash
# Verificar logs detalhados
docker-compose -f docker-compose.local.yml logs

# Verificar se portas estão disponíveis
netstat -tulpn | grep :5000
```

### Problema: Banco de dados não conecta
```bash
# Verificar se PostgreSQL está rodando
docker-compose -f docker-compose.local.yml exec postgres psql -U user -d rsv -c "SELECT 1;"

# Verificar variáveis de ambiente
docker-compose -f docker-compose.local.yml exec core-service env | grep DATABASE
```

### Problema: Frontend não carrega
```bash
# Verificar se frontend está rodando
docker-compose -f docker-compose.local.yml logs frontend

# Verificar se APIs estão respondendo
curl http://localhost:5000/health
```

## 📈 Testes de Performance

### Teste de Carga Simples
```bash
# Instalar Apache Bench (se disponível)
# Ubuntu: sudo apt-get install apache2-utils
# macOS: brew install httpd

# Teste de carga no Core Service
ab -n 100 -c 10 http://localhost:5000/health

# Teste de carga no Frontend
ab -n 100 -c 10 http://localhost:3000/
```

### Monitoramento de Recursos
```bash
# Ver uso de CPU e memória
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Ver logs de performance
docker-compose -f docker-compose.local.yml logs | grep -i "performance\|slow\|timeout"
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

Se encontrar problemas durante o teste:

1. **Verifique os logs**: `docker-compose -f docker-compose.local.yml logs`
2. **Consulte a documentação**: README.md
3. **Verifique recursos**: Certifique-se de ter RAM suficiente
4. **Reinicie os serviços**: `docker-compose -f docker-compose.local.yml restart`

---

**🎉 Parabéns!** Se chegou até aqui, o sistema Onion 360 RSV está funcionando perfeitamente em seu ambiente local! 