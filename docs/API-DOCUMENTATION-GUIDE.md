# 📜 DOCUMENTAÇÃO COMPLETA DAS APIs - ONION RSV 360

**Sistema de Turismo com 32 Microserviços Documentados**  
**Última atualização:** 05/08/2025

---

## 🎯 **ACESSO À DOCUMENTAÇÃO**

### **🌐 URLs de Documentação Ativa:**

#### **Via Load Balancer (Nginx):**
- **Portal Principal:** http://localhost/docs
- **Status Geral:** http://localhost/api/status
- **OpenAPI Aggregated:** http://localhost/openapi.json

#### **Serviços Individuais:**
- **Core Service:** http://localhost:5000/docs
- **Travel Service:** http://localhost:5003/docs  
- **Finance Service:** http://localhost:5005/docs
- **Tickets Service:** http://localhost:5006/docs
- **Payments Service:** http://localhost:5007/docs
- **E-commerce Service:** http://localhost:5008/docs

---

## 📋 **ÍNDICE COMPLETO DE APIs**

### 🔧 **CORE SERVICES (4 APIs)**

#### **1. Core Service API** 🔧
- **URL:** http://localhost:5000/docs
- **Descrição:** Serviço central - autenticação, configurações
- **Endpoints Principais:**
  - `GET /health` - Health check
  - `GET /api/status` - Status detalhado
  - `GET /api/security/info` - Informações de segurança
  - `POST /api/auth/demo` - Token de demonstração

#### **2. Travel Service API** 🌍
- **URL:** http://localhost:5003/docs
- **Descrição:** Gestão de viagens, roteiros, destinos
- **Recursos:** Destinos, Itinerários, Reservas de viagem

#### **3. Finance Service API** 💰
- **URL:** http://localhost:5005/docs
- **Descrição:** Sistema financeiro completo
- **Recursos:** Transações, Faturas, Relatórios financeiros

#### **4. Tickets Service API** 🎫
- **URL:** http://localhost:5006/docs
- **Descrição:** Ingressos, reservas, controle de acesso
- **Recursos:** Ingressos, Reservas, Controle de acesso

---

### 💼 **BUSINESS SERVICES (6 APIs)**

#### **5. Payments Service API** 💳
- **URL:** http://localhost:5007/docs
- **Descrição:** Processamento de pagamentos seguro
- **Recursos:** Pagamentos, Estornos, Gateway integration

#### **6. E-commerce Service API** 🛒
- **URL:** http://localhost:5008/docs
- **Descrição:** Loja virtual para produtos turísticos
- **Recursos:** Produtos, Carrinho, Pedidos

#### **7. Vouchers Service API** 🎟️
- **URL:** http://localhost:5010/docs
- **Recursos:** Sistema de vouchers e cupons

#### **8. Voucher Editor API** ✏️
- **URL:** http://localhost:5011/docs
- **Recursos:** Editor de templates de vouchers

#### **9. Gift Cards Service API** 🎁
- **URL:** http://localhost:5012/docs
- **Recursos:** Cartões presente digitais

#### **10. Coupons Service API** 🏷️
- **URL:** http://localhost:5013/docs
- **Recursos:** Sistema de cupons de desconto

---

### 🎯 **SPECIALIZED SERVICES (10 APIs)**

#### **11. Attractions Service API** 🎢
- **URL:** http://localhost:5009/docs
- **Recursos:** Atrações turísticas e pontos de interesse

#### **12. Parks Service API** 🏞️
- **URL:** http://localhost:5014/docs
- **Recursos:** Gestão de parques e áreas naturais

#### **13. Maps Service API** 🗺️
- **URL:** http://localhost:5015/docs
- **Recursos:** Geolocalização, mapas, rotas

#### **14. Visa Service API** 📋
- **URL:** http://localhost:5016/docs
- **Recursos:** Processamento de vistos e documentação

#### **15. Marketing Service API** 📢
- **URL:** http://localhost:5017/docs
- **Recursos:** Campanhas e promoções

#### **16. Subscriptions Service API** 📝
- **URL:** http://localhost:5018/docs
- **Recursos:** Assinaturas e memberships

#### **17. SEO Service API** 🔍
- **URL:** http://localhost:5019/docs
- **Recursos:** Otimização para buscadores

#### **18. Multilingual Service API** 🌐
- **URL:** http://localhost:5020/docs
- **Recursos:** Suporte multilíngue

#### **19. Videos Service API** 🎥
- **URL:** http://localhost:5021/docs
- **Recursos:** Gestão de conteúdo de vídeo

#### **20. Photos Service API** 📸
- **URL:** http://localhost:5022/docs
- **Recursos:** Gestão de imagens e galeria

---

### 📊 **MANAGEMENT SYSTEMS (4 APIs)**

#### **21. Admin Service API** ⚙️
- **URL:** http://localhost:5023/docs
- **Recursos:** Painel administrativo completo

#### **22. Analytics Service API** 📈
- **URL:** http://localhost:5024/docs
- **Recursos:** Análises e métricas detalhadas

#### **23. Reports Service API** 📊
- **URL:** http://localhost:5025/docs
- **Recursos:** Geração de relatórios executivos

#### **24. Data Service API** 🗃️
- **URL:** http://localhost:5026/docs
- **Recursos:** Processamento e análise de dados

---

### 👥 **USER SERVICES (4 APIs)**

#### **25. Notifications Service API** 🔔
- **URL:** http://localhost:5027/docs
- **Recursos:** Sistema de notificações

#### **26. Reviews Service API** ⭐
- **URL:** http://localhost:5028/docs
- **Recursos:** Avaliações e comentários

#### **27. Rewards Service API** 🏆
- **URL:** http://localhost:5029/docs
- **Recursos:** Sistema de recompensas

#### **28. Loyalty Service API** 💎
- **URL:** http://localhost:5030/docs
- **Recursos:** Programa de fidelidade

---

### 💰 **BUSINESS OPERATIONS (4 APIs)**

#### **29. Sales Service API** 💼
- **URL:** http://localhost:5031/docs
- **Recursos:** Gestão de vendas

#### **30. Sectoral Finance API** 🏦
- **URL:** http://localhost:5032/docs
- **Recursos:** Finanças por setor

#### **31. Refunds Service API** 💸
- **URL:** http://localhost:5033/docs
- **Recursos:** Processamento de reembolsos

#### **32. Inventory Service API** 📦
- **URL:** http://localhost:5034/docs
- **Recursos:** Controle de estoque

---

## 🔐 **AUTENTICAÇÃO E SEGURANÇA**

### **Sistema de Autenticação JWT:**

#### **1. Obter Token:**
```bash
POST http://localhost:5000/api/auth/demo
# Retorna: { "demo_token": "eyJ0eXAi..." }
```

#### **2. Usar Token:**
```bash
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

### **Rate Limiting:**
- **60 requests/minuto** por IP
- **1000 requests/hora** por IP
- **Headers informativos** em cada resposta

### **Segurança Ativa:**
- ✅ JWT Authentication
- ✅ Rate Limiting 
- ✅ CORS Policy
- ✅ Security Headers
- ✅ Input Validation

---

## 🧪 **TESTANDO AS APIs**

### **Teste Rápido com cURL:**

```bash
# Health check geral
curl http://localhost:5000/health

# Status do sistema
curl http://localhost:5000/api/status

# Obter token de demonstração
curl -X POST http://localhost:5000/api/auth/demo

# Usar token em endpoint protegido
curl -H "Authorization: Bearer <token>" \
     http://localhost:5000/api/security/info

# Testar rate limiting
for i in {1..70}; do curl http://localhost:5000/health; done
```

### **Teste com PowerShell:**

```powershell
# Testar todos os endpoints de documentação
$services = @(5000, 5003, 5005, 5006, 5007, 5008, 5009, 5010)
foreach ($port in $services) {
    Write-Host "Testando docs na porta $port..."
    curl "http://localhost:$port/docs"
}
```

---

## 📖 **RECURSOS DE DOCUMENTAÇÃO**

### **Swagger UI Features:**
- ✅ **Try it out** - Testar APIs diretamente
- ✅ **Modelos** - Esquemas detalhados
- ✅ **Exemplos** - Requests e responses
- ✅ **Autenticação** - Suporte a JWT
- ✅ **Download** - OpenAPI spec

### **OpenAPI 3.1 Compliance:**
- ✅ Especificação OpenAPI 3.1
- ✅ Schemas Pydantic
- ✅ Validação automática
- ✅ Geração de código
- ✅ Compatibilidade Postman

---

## 🎯 **PRÓXIMOS PASSOS**

### **Documentação Avançada:**
1. **API Gateway** - Documentação unificada
2. **SDK Generation** - Clientes automáticos
3. **Testing Suite** - Testes automatizados
4. **Monitoring** - Métricas de uso das APIs

### **Melhorias Planejadas:**
- 🔄 Auto-refresh da documentação
- 📱 Versão mobile-friendly
- 🌍 Suporte multilíngue
- 📊 Analytics de uso das APIs

---

## 🆘 **SUPORTE**

### **Links Úteis:**
- **Documentação Geral:** [/docs](/docs)
- **Status do Sistema:** [/api/status](/api/status)
- **Health Checks:** [/health](/health)

### **Resolução de Problemas:**
- **503 Service Unavailable**: Verificar se containers estão rodando
- **401 Unauthorized**: Verificar token JWT
- **429 Too Many Requests**: Aguardar rate limiting

---

**📜 SISTEMA COMPLETO COM 32 APIs DOCUMENTADAS!**

**Acesso Principal:** http://localhost:5000/docs  
**Status:** 100% Operacional + Documentação Swagger Completa  
**Última verificação:** 05/08/2025 01:55