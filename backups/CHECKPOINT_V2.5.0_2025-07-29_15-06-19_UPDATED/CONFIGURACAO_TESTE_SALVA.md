# 🔧 CONFIGURAÇÃO DE TESTE SALVA - Onion RSV 360

## 📋 Informações do Sistema

**Data de Criação:** 25/07/2025  
**Versão:** 2.2.0  
**Status:** Sistema 100% Funcional  
**Ambiente:** Desenvolvimento/Teste

---

## 🌐 URLs de Acesso

### Frontend
- **URL:** http://localhost:3000
- **Status:** ✅ Funcionando
- **Framework:** Next.js

### Backend APIs
- **API Core:** http://localhost:5000
- **Health Check:** http://localhost:5000/health
- **API Status:** http://localhost:5000/api/status

### Banco de Dados
- **Adminer:** http://localhost:8080
- **PostgreSQL:** localhost:5432
- **Redis:** localhost:6379

---

## 🔐 Credenciais de Teste

### Usuário Principal
- **Email:** `test@onion360.com`
- **Senha:** `test123`
- **Nome:** Usuario Teste
- **Status:** ✅ Ativo

### Usuário Alternativo (se necessário)
- **Email:** `admin@onion360.com`
- **Senha:** `admin123`
- **Nome:** Administrador
- **Status:** ⚠️ Pode precisar ser recriado

---

## 🐳 Configuração Docker

### Comando de Inicialização
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Serviços Principais
- **core-service:** Porta 5000
- **postgres:** Porta 5432
- **redis:** Porta 6379
- **adminer:** Porta 8080

### Script de Inicialização Automática
```bash
.\start-onion360-test.ps1
```

---

## 🔧 Configurações Técnicas

### Backend (Core Service)
- **Framework:** FastAPI
- **Python:** 3.11
- **Banco:** PostgreSQL
- **Cache:** Redis
- **Autenticação:** JWT + Bcrypt

### Frontend
- **Framework:** Next.js
- **Porta:** 3000
- **Autenticação:** Context API + JWT

### Dependências Principais
```
fastapi==0.109.0
uvicorn==0.25.0
sqlalchemy==2.0.25
psycopg2-binary==2.9.9
redis==5.0.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
email-validator==2.1.0
```

---

## 🚀 Scripts Disponíveis

### 1. Inicialização Completa
```bash
.\start-onion360-test.ps1
```

### 2. Teste de Autenticação
```bash
.\auth-test.ps1
```

### 3. Criação de Usuário
```bash
.\clean-and-create-user.ps1
```

### 4. Verificação de Status
```bash
docker-compose ps
```

---

## 📝 Endpoints da API

### Autenticação
- `POST /api/core/token` - Login
- `POST /api/core/refresh` - Renovar token
- `GET /api/core/verify` - Verificar token
- `POST /api/users/` - Criar usuário
- `GET /api/users/me` - Dados do usuário

### Sistema
- `GET /health` - Health check
- `GET /api/status` - Status da API
- `GET /` - Informações do serviço

---

## 🛠️ Comandos Úteis

### Iniciar Sistema
```bash
cd "rsv-onion360"
.\start-onion360-test.ps1
```

### Parar Sistema
```bash
docker-compose -f docker-compose.dev.yml down
```

### Ver Logs
```bash
docker-compose logs core-service
```

### Reconstruir Container
```bash
docker-compose -f docker-compose.dev.yml build --no-cache core-service
```

### Reiniciar Serviço
```bash
docker-compose -f docker-compose.dev.yml restart core-service
```

---

## 🔍 Troubleshooting

### Problema: API não responde
```bash
docker-compose -f docker-compose.dev.yml restart core-service
```

### Problema: Login falha
```bash
.\clean-and-create-user.ps1
```

### Problema: Frontend não carrega
```bash
cd frontend
npm run dev
```

### Problema: Container não inicia
```bash
docker-compose -f docker-compose.dev.yml build --no-cache core-service
docker-compose -f docker-compose.dev.yml up -d core-service
```

---

## 📊 Status de Teste

### ✅ Funcionando
- [x] API Core
- [x] Autenticação JWT
- [x] Criação de usuários
- [x] Login
- [x] Verificação de token
- [x] Frontend Next.js
- [x] Banco PostgreSQL
- [x] Cache Redis
- [x] Health checks

### ⚠️ Observações
- Validação de senha simplificada para desenvolvimento
- Sanitização de input simplificada
- Dependências otimizadas

---

## 🎯 Como Usar

1. **Execute o script de inicialização:**
   ```bash
   .\start-onion360-test.ps1
   ```

2. **Acesse o frontend:**
   - URL: http://localhost:3000

3. **Faça login:**
   - Email: `test@onion360.com`
   - Senha: `test123`

4. **Teste as funcionalidades**

---

## 📞 Suporte

### Arquivos de Log
- `logs/` - Logs do sistema
- `docker-compose logs` - Logs dos containers

### Documentação
- `STATUS_FINAL_LOGIN_FUNCIONANDO.md` - Status detalhado
- `RESOLUCAO_FINAL_AUTENTICACAO.md` - Resolução de problemas

---

**Onion RSV 360 v2.2.0 - Sistema de Reservas e Turismo**  
**Configuração de Teste Salva - Pronta para Uso** 🚀 