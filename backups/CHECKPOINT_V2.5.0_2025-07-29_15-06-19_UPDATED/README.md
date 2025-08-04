# Onion RSV 360 - Sistema de Turismo Completo

## 🚀 Visão Geral

O **Onion RSV 360** é um sistema completo de turismo desenvolvido com arquitetura de microserviços, oferecendo uma solução robusta e escalável para gestão de reservas, propriedades, atrações turísticas e muito mais.

### ✨ Características Principais

- **Arquitetura de Microserviços** com FastAPI
- **Frontend Moderno** com Next.js/React
- **Autenticação JWT** robusta e segura
- **Banco de Dados PostgreSQL** com Redis para cache
- **Docker** para containerização
- **Monitoramento** com Prometheus
- **Interface Responsiva** e acessível
- **Sistema de Permissões** granular
- **Rate Limiting** e proteções de segurança

## 🏗️ Arquitetura

### Backend (Microserviços)
- **Serviço Core**: Autenticação e gerenciamento de usuários
- **Serviço de Viagens**: Gestão de viagens e reservas
- **Serviço Financeiro**: Processamento financeiro
- **Serviço de Notificações**: Sistema de notificações
- **Serviço de Dados**: Gerenciamento de dados
- **Serviço E-commerce**: Produtos e vendas
- **Serviço de Ingressos**: Gestão de ingressos
- **Serviço de Parques**: Parques e atrações
- **Serviço de Atrações**: Atrações turísticas
- **Serviço de Estoque**: Controle de estoque
- **Serviço de Vendas**: Gestão de vendas
- **Serviço de Marketing**: Campanhas de marketing
- **Serviço de Analytics**: Análises e relatórios
- **Serviço SEO**: Otimização para motores de busca
- **Serviço Multilíngue**: Suporte a múltiplos idiomas
- **Serviço de Assinaturas**: Gestão de assinaturas
- **Serviço de Cartões-Presente**: Cartões-presente
- **Serviço de Cupons**: Cupons de desconto
- **Serviço de Recompensas**: Sistema de recompensas

### Frontend
- **Next.js 13+** com TypeScript
- **Tailwind CSS** para estilização
- **Context API** para gerenciamento de estado
- **Autenticação JWT** com renovação automática
- **Proteção de Rotas** baseada em permissões
- **Interface Responsiva** e acessível

## 🛠️ Tecnologias

### Backend
- **FastAPI** - Framework web moderno
- **SQLAlchemy** - ORM para banco de dados
- **PostgreSQL** - Banco de dados principal
- **Redis** - Cache e sessões
- **JWT** - Autenticação segura
- **Pydantic** - Validação de dados
- **Alembic** - Migrações de banco
- **Celery** - Processamento assíncrono

### Frontend
- **Next.js** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS
- **Axios** - Cliente HTTP
- **React Context** - Gerenciamento de estado

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **Prometheus** - Monitoramento
- **Nginx** - Proxy reverso

## 📋 Pré-requisitos

### Para Desenvolvimento
- **Docker Desktop** (Windows/Mac) ou **Docker** (Linux)
- **Node.js** 18+ (para desenvolvimento frontend)
- **Python** 3.9+ (para desenvolvimento backend)
- **Git**

### Para Produção
- **VPS** com Docker
- **Domínio** configurado
- **Certificado SSL**

## 🚀 Instalação e Configuração

### 1. Clone o Repositório
```bash
git clone <repository-url>
cd rsv-onion360
```

### 2. Configuração Inicial

#### Windows (PowerShell)
```powershell
# Iniciar ambiente de desenvolvimento
.\scripts\start-dev.ps1

# Parar ambiente de desenvolvimento
.\scripts\stop-dev.ps1
```

#### Linux/Mac (Bash)
```bash
# Tornar scripts executáveis
chmod +x scripts/start-dev.sh scripts/stop-dev.sh

# Iniciar ambiente de desenvolvimento
./scripts/start-dev.sh

# Parar ambiente de desenvolvimento
./scripts/stop-dev.sh
```

### 3. Configuração Manual (Alternativa)

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Serviços Docker
```bash
docker-compose up -d
```

## 🌐 URLs de Acesso

Após a inicialização, os serviços estarão disponíveis em:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Serviço Core**: http://localhost:5000
- **Adminer (DB)**: http://localhost:8080
- **Prometheus**: http://localhost:9090

## 🔐 Autenticação

### Criar Primeiro Usuário
```bash
# Via API
curl -X POST "http://localhost:5000/api/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@exemplo.com",
    "full_name": "Administrador",
    "password": "Senha123!"
  }'
```

### Login
1. Acesse http://localhost:3000/login
2. Use as credenciais criadas
3. O sistema irá redirecionar para o painel de controle

## 📁 Estrutura do Projeto

```
rsv-onion360/
├── backend/                 # Microserviços backend
│   ├── core/               # Serviço de autenticação
│   ├── travel/             # Serviço de viagens
│   ├── finance/            # Serviço financeiro
│   ├── shared/             # Código compartilhado
│   └── requirements.txt    # Dependências Python
├── frontend/               # Aplicação Next.js
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── context/       # Contextos React
│   │   └── styles/        # Estilos globais
│   └── package.json       # Dependências Node.js
├── docker/                 # Configurações Docker
├── scripts/                # Scripts de automação
├── docs/                   # Documentação
└── docker-compose.yml     # Orquestração de serviços
```

## 🔧 Configuração de Ambiente

### Variáveis de Ambiente
Copie o arquivo `env.example` para `.env` e configure:

```env
# Banco de Dados
DATABASE_URL=postgresql://user:password@localhost/rsv
REDIS_URL=redis://localhost:6379

# Segurança
SECRET_KEY=sua-chave-secreta-aqui
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000

# Docker
DOCKER_COMPOSE_PROJECT_NAME=rsv-onion360
```

## 🧪 Testes

### Backend
```bash
cd backend
source venv/bin/activate
pytest
```

### Frontend
```bash
cd frontend
npm test
```

## 📊 Monitoramento

### Logs
- **Frontend**: `logs/frontend.log`
- **Docker**: `docker-compose logs -f [servico]`

### Métricas
- **Prometheus**: http://localhost:9090
- **Grafana**: Configurado para visualização

## 🔒 Segurança

### Implementado
- ✅ Autenticação JWT com tokens de renovação
- ✅ Rate limiting por IP
- ✅ Validação de senhas robusta
- ✅ Sanitização de inputs
- ✅ CORS configurado
- ✅ Headers de segurança
- ✅ Logs de auditoria

### Recomendações para Produção
- 🔒 Usar HTTPS
- 🔒 Configurar firewall
- 🔒 Backup automático do banco
- 🔒 Monitoramento de segurança
- 🔒 Atualizações regulares

## 🚀 Deploy em Produção

### VPS com Docker
1. Clone o repositório no servidor
2. Configure as variáveis de ambiente
3. Execute: `docker-compose -f docker-compose.prod.yml up -d`

### Configuração de Domínio
1. Configure DNS para apontar para o servidor
2. Configure SSL com Let's Encrypt
3. Atualize as URLs no frontend

## 📚 Documentação Adicional

- [Guia de Instalação](docs/installation/guide.md)
- [Guia de Desenvolvimento](docs/training/developer_guide.md)
- [Guia de Uso](docs/usage/guide.md)
- [Auditoria de Arquitetura](Arquitetura%20de%20Soluções%20Union%20RSV/)

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua funcionalidade
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Para suporte e dúvidas:
- 📧 Email: suporte@onionrsv.com
- 📖 Documentação: [docs/](docs/)
- 🐛 Issues: [GitHub Issues](https://github.com/onionrsv/rsv-onion360/issues)

## 🔄 Changelog

### Versão 2.0.0 (Atual)
- ✨ Sistema de autenticação JWT robusto
- 🔒 Melhorias de segurança
- 🎨 Interface moderna e responsiva
- 📊 Painel de controle com estatísticas
- 🚀 Scripts de automação
- 📝 Documentação completa
- 🇧🇷 Interface em português brasileiro

### Versão 1.0.0
- 🎉 Lançamento inicial
- 🏗️ Arquitetura de microserviços
- 🌐 Frontend básico
- 🗄️ Banco de dados PostgreSQL

---

**Onion RSV 360** - Transformando a experiência do turismo digital 🏖️ 