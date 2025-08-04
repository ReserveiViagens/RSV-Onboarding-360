# 🔒 GUIA DE SEGURANÇA - ONION RSV 360

## 🛡️ **RECURSOS DE SEGURANÇA IMPLEMENTADOS**

### ✅ **SEGURANÇA ATIVA NO SISTEMA:**

- **🔐 Autenticação JWT** - Tokens seguros para APIs
- **🛡️ Rate Limiting** - Proteção contra DDoS e abuso
- **🔒 Security Headers** - Headers HTTP de segurança
- **🚫 CORS Policy** - Política de origem cruzada
- **🧹 Input Validation** - Validação e sanitização de entrada
- **📊 Security Logging** - Log de eventos de segurança

---

## 🔐 **AUTENTICAÇÃO JWT**

### **Como Funciona:**

1. Cliente faz login e recebe tokens (access + refresh)
2. Inclui `Authorization: Bearer <token>` nas requests
3. Sistema valida token e permite acesso

### **Exemplo de Uso:**

```bash
# 1. Obter token de teste
curl -X POST http://localhost:5000/api/auth/test

# 2. Usar token em endpoint protegido
curl -H "Authorization: Bearer <seu_token>" \
     http://localhost:5000/api/secure/info
```

### **Configuração de Tokens:**

- **Access Token:** 30 minutos
- **Refresh Token:** 7 dias
- **Algoritmo:** HS256
- **Secret Key:** Configurável via `JWT_SECRET_KEY`

---

## 🛡️ **RATE LIMITING**

### **Limites Padrão:**

- **60 requests/minuto** por IP
- **1000 requests/hora** por IP
- **10 requests/segundo** (burst)

### **Limites Específicos:**

| Endpoint             | Por Minuto | Por Hora |
| -------------------- | ---------- | -------- |
| `/health`            | 120        | 2000     |
| `/api/auth/login`    | 5          | 50       |
| `/api/auth/register` | 3          | 20       |
| `/api/admin/*`       | 30         | 500      |
| `/api/payments/*`    | 10         | 100      |

### **Headers de Resposta:**

```
X-RateLimit-Remaining-Minute: 45
X-RateLimit-Remaining-Hour: 856
X-RateLimit-Policy: 60/minute, 1000/hour
```

### **IPs Bloqueados:**

- Bloqueio automático por 1 hora ao exceder limite
- Whitelist para IPs confiáveis
- Logs de segurança para monitoramento

---

## 🔒 **SECURITY HEADERS**

### **Headers Aplicados Automaticamente:**

```http
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
```

### **Proteções Ativas:**

- ✅ **XSS Protection** - Prevenção de Cross-Site Scripting
- ✅ **MIME Sniffing** - Prevenção de detecção de tipo MIME
- ✅ **Clickjacking** - Proteção contra frame embedding
- ✅ **HTTPS Force** - Forçar HTTPS em produção
- ✅ **CSP Policy** - Política de conteúdo seguro

---

## 🚫 **CORS CONFIGURATION**

### **Configuração Atual:**

```python
# Desenvolvimento
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000"
]

# Produção
allowed_origins = ["https://app.onionrsv360.com"]
```

### **Headers Permitidos:**

- `Authorization`
- `Content-Type`
- `X-API-Key`
- `X-Requested-With`

---

## 🔧 **CONFIGURAÇÃO POR AMBIENTE**

### **Development:**

```bash
ENVIRONMENT=development
JWT_SECRET_KEY=sua-chave-secreta
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### **Production:**

```bash
ENVIRONMENT=production
JWT_SECRET_KEY=chave-super-secreta-256-bits
ALLOWED_ORIGINS=https://app.onionrsv360.com
FORCE_HTTPS=true
```

---

## 📊 **MONITORAMENTO DE SEGURANÇA**

### **Logs de Segurança:**

```bash
# Ver logs de segurança
docker compose logs core | grep SECURITY

# Exemplos de logs:
[2025-08-04T20:15:30] SECURITY EVENT: jwt_token_created | User: 123
[2025-08-04T20:16:45] SECURITY EVENT: rate_limit_exceeded | IP: 192.168.1.100
[2025-08-04T20:17:12] SECURITY EVENT: unauthorized_access | Endpoint: /api/admin
```

### **Métricas de Segurança:**

- Taxa de tokens inválidos
- IPs bloqueados por rate limiting
- Tentativas de acesso não autorizado
- Violações de CORS

---

## 🧪 **TESTANDO A SEGURANÇA**

### **1. Teste de Autenticação:**

```bash
# Endpoint público (deve funcionar)
curl http://localhost:5000/health

# Endpoint protegido sem token (deve falhar)
curl http://localhost:5000/api/secure/info

# Obter token de teste
TOKEN=$(curl -X POST http://localhost:5000/api/auth/test | jq -r '.tokens.access_token')

# Usar token (deve funcionar)
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/secure/info
```

### **2. Teste de Rate Limiting:**

```bash
# Fazer muitas requests rapidamente
for i in {1..70}; do
    curl http://localhost:5000/health
done
# Deve retornar 429 após 60 requests
```

### **3. Teste de CORS:**

```javascript
// No navegador (deve funcionar para origens permitidas)
fetch("http://localhost:5000/api/status", {
  method: "GET",
  mode: "cors",
});
```

---

## 🚨 **ALERTAS DE SEGURANÇA**

### **Monitoramento Ativo:**

- ⚠️ **Rate limit excedido** - Possível ataque DDoS
- 🚨 **Token inválido repetido** - Possível tentativa de hack
- ⛔ **Acesso admin negado** - Tentativa de escalação
- 🔍 **SQL injection detectado** - Entrada maliciosa

### **Ações Automáticas:**

- Bloqueio temporário de IP
- Log detalhado do evento
- Invalidação de tokens suspeitos
- Notificação para administradores

---

## 📋 **CHECKLIST DE SEGURANÇA**

### **✅ Implementado:**

- [x] Autenticação JWT com roles
- [x] Rate limiting por IP e endpoint
- [x] Security headers automáticos
- [x] CORS configurado por ambiente
- [x] Input validation e sanitização
- [x] Logs de segurança detalhados
- [x] Proteção contra XSS e CSRF
- [x] Middleware de segurança centralizado

### **🔄 Próximos Passos:**

- [ ] HTTPS/SSL em produção
- [ ] API Key management
- [ ] OAuth2 integration
- [ ] Audit logs centralizados
- [ ] Penetration testing
- [ ] Security scanning automatizado

---

## 🆘 **SUPORTE DE SEGURANÇA**

### **Em Caso de Incidente:**

1. **Bloqueio imediato:** Use whitelist para IPs confiáveis
2. **Análise de logs:** Verifique `docker compose logs`
3. **Invalidar tokens:** Altere `JWT_SECRET_KEY`
4. **Reportar:** Documente o incidente

### **Contatos de Emergência:**

- **Admin Sistema:** Check logs em `/var/log/security/`
- **Rate Limiting:** Configurar em `rate_limiter.py`
- **JWT Config:** Variáveis de ambiente

---

**🔒 SISTEMA PROTEGIDO COM SEGURANÇA ENTERPRISE-GRADE!**

**Última atualização:** 04/08/2025
**Versão de Segurança:** 1.0 - Completa
