# ESPECIFICAÇÕES TÉCNICAS - VPS ICP MAX
## Sistema Onion 360 RSV - Implementação Técnica

---

## 🖥️ CONFIGURAÇÃO VPS ICP MAX

### Recursos Alocados
```
💻 ESPECIFICAÇÕES ICP MAX
├── CPU: 8 vCore @ 2.6 GHz (AMD EPYC™)
├── RAM: 24 GB DDR4
├── Storage: 300 GB SSD NVMe (RAID 10)
├── Network: 1 Gbps + Proteção DDoS
├── OS: AlmaLinux 9
├── IP: 1 IP Dedicado
└── SSL: Certificado Gratuito
```

### Distribuição de Recursos
```
📊 DISTRIBUIÇÃO RECURSOS
├── 🧠 MEMÓRIA (24 GB)
│   ├── Sistema: 2 GB
│   ├── PostgreSQL: 8 GB
│   ├── Redis: 2 GB
│   ├── Node.js: 4 GB
│   ├── Nginx: 1 GB
│   └── Buffer: 7 GB
├── 💾 STORAGE (300 GB)
│   ├── Sistema: 20 GB
│   ├── PostgreSQL: 100 GB
│   ├── Aplicação: 50 GB
│   ├── Logs: 30 GB
│   ├── Backup: 80 GB
│   └── Cache: 20 GB
└── 💻 CPU (8 vCore)
    ├── PostgreSQL: 2 cores
    ├── Node.js: 3 cores
    ├── Nginx: 1 core
    └── Sistema: 2 cores
```

---

## 🗄️ BANCO DE DADOS POSTGRESQL

### Configuração Otimizada
```sql
-- Configurações PostgreSQL para ICP
ALTER SYSTEM SET shared_buffers = '8GB';
ALTER SYSTEM SET effective_cache_size = '16GB';
ALTER SYSTEM SET maintenance_work_mem = '256MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;
ALTER SYSTEM SET work_mem = '4MB';
ALTER SYSTEM SET min_wal_size = '1GB';
ALTER SYSTEM SET max_wal_size = '4GB';

-- Configurações de conexão
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';

-- Configurações de log
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_duration_statement = 1000;
ALTER SYSTEM SET log_checkpoints = on;
ALTER SYSTEM SET log_connections = on;
ALTER SYSTEM SET log_disconnections = on;
```

### Estrutura de Tabelas Otimizada
```sql
-- Tabelas principais com índices otimizados
CREATE TABLE hotels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    stars INTEGER CHECK (stars >= 1 AND stars <= 5),
    rating DECIMAL(3, 2),
    amenities JSONB,
    policies JSONB,
    contact_info JSONB,
    photos JSONB,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_hotels_city ON hotels(city);
CREATE INDEX idx_hotels_location ON hotels USING GIST (ll_to_earth(latitude, longitude));
CREATE INDEX idx_hotels_rating ON hotels(rating);
CREATE INDEX idx_hotels_stars ON hotels(stars);
CREATE INDEX idx_hotels_status ON hotels(status);
CREATE INDEX idx_hotels_search ON hotels USING GIN (to_tsvector('portuguese', name || ' ' || description));

-- Particionamento por data para tabelas grandes
CREATE TABLE bookings_2024 PARTITION OF bookings
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE payments_2024 PARTITION OF payments
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

---

## 🐳 DOCKER COMPOSE CONFIGURAÇÃO

### docker-compose.yml Otimizado
```yaml
version: '3.8'

services:
  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
    networks:
      - rsv-network

  # Frontend Next.js
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.seudominio.com
    volumes:
      - ./logs/frontend:/app/logs
    restart: unless-stopped
    networks:
      - rsv-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Backend Node.js
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://rsv_user:${DB_PASSWORD}@postgres:5432/rsv_tourism
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - PORT=5000
    volumes:
      - ./logs/backend:/app/logs
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - rsv-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: rsv_tourism
      POSTGRES_USER: rsv_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_INITDB_ARGS: "--encoding=UTF-8 --lc-collate=C --lc-ctype=C"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backup:/backup
      - ./init-scripts:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - rsv-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U rsv_user -d rsv_tourism"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis Cache
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --maxmemory 2gb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped
    networks:
      - rsv-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Backup Service
  backup:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backup:/backup
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    command: |
      sh -c '
      while true; do
        pg_dump -h postgres -U rsv_user -d rsv_tourism > /backup/backup_$$(date +%Y%m%d_%H%M%S).sql
        find /backup -name "backup_*.sql" -mtime +7 -delete
        sleep 86400
      done
      '
    depends_on:
      - postgres
    restart: unless-stopped
    networks:
      - rsv-network

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

networks:
  rsv-network:
    driver: bridge
```

---

## 🔒 CONFIGURAÇÃO DE SEGURANÇA

### Nginx Security Configuration
```nginx
# nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Upstream servers
    upstream frontend {
        server frontend:3000;
    }

    upstream backend {
        server backend:5000;
    }

    # HTTP to HTTPS redirect
    server {
        listen 80;
        server_name seudominio.com www.seudominio.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name seudominio.com www.seudominio.com;

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # API endpoints
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Login endpoint (stricter rate limiting)
        location /api/auth/login {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

---

## 📊 MONITORAMENTO E LOGS

### Configuração de Logs
```bash
# Estrutura de logs
mkdir -p /var/log/rsv/{nginx,backend,frontend,postgres,redis}

# Log rotation
cat > /etc/logrotate.d/rsv << EOF
/var/log/rsv/*/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 nginx nginx
    postrotate
        docker exec rsv-nginx nginx -s reload
    endscript
}
EOF
```

### Métricas de Monitoramento
```javascript
// Métricas para ICP Dashboard
const metrics = {
  // Performance
  responseTime: 'ms',
  throughput: 'req/s',
  errorRate: '%',
  
  // Resources
  cpuUsage: '%',
  memoryUsage: '%',
  diskUsage: '%',
  networkIO: 'MB/s',
  
  // Application
  activeConnections: 'count',
  databaseConnections: 'count',
  cacheHitRate: '%',
  
  // Business
  bookingsPerHour: 'count',
  revenuePerDay: 'R$',
  conversionRate: '%'
};
```

---

## 🚀 DEPLOYMENT AUTOMATIZADO

### Script de Deploy
```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Iniciando deploy no ICP MAX..."

# 1. Backup atual
echo "📦 Criando backup..."
docker exec rsv-postgres pg_dump -U rsv_user rsv_tourism > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Pull latest changes
echo "📥 Atualizando código..."
git pull origin main

# 3. Build new images
echo "🔨 Construindo imagens..."
docker-compose build --no-cache

# 4. Deploy with zero downtime
echo "🔄 Deploy com zero downtime..."
docker-compose up -d --no-deps backend
sleep 10
docker-compose up -d --no-deps frontend

# 5. Health checks
echo "🏥 Verificando saúde dos serviços..."
./health-check.sh

# 6. Cleanup
echo "🧹 Limpeza..."
docker system prune -f

echo "✅ Deploy concluído com sucesso!"
```

### Health Check Script
```bash
#!/bin/bash
# health-check.sh

services=("frontend" "backend" "postgres" "redis")

for service in "${services[@]}"; do
  echo "Verificando $service..."
  
  if docker-compose ps $service | grep -q "Up"; then
    echo "✅ $service está rodando"
  else
    echo "❌ $service falhou"
    exit 1
  fi
done

# API health check
if curl -f http://localhost/api/health > /dev/null 2>&1; then
  echo "✅ API está respondendo"
else
  echo "❌ API não está respondendo"
  exit 1
fi

echo "🎉 Todos os serviços estão saudáveis!"
```

---

## 💰 CUSTOS E OTIMIZAÇÃO

### Análise de Custos ICP
```
💰 CUSTOS ICP MAX
├── 💻 INFRAESTRUTURA
│   ├── VPS ICP MAX: R$ 143,91/mês
│   ├── Domínio: R$ 50/ano
│   ├── SSL: Grátis
│   └── Backup: Incluído
├── 🛠️ DESENVOLVIMENTO
│   ├── 12 semanas: R$ 24.000
│   ├── Especialização: R$ 6.000
│   └── Total: R$ 30.000
└── 📊 OPERAÇÃO
    ├── Monitoramento: Incluído
    ├── Suporte: Incluído
    ├── Atualizações: Incluído
    └── Segurança: Incluído
```

### Otimizações de Performance
```
⚡ OTIMIZAÇÕES PERFORMANCE
├── 🗄️ BANCO DE DADOS
│   ├── Índices otimizados
│   ├── Query optimization
│   ├── Connection pooling
│   └── Read replicas
├── 🔴 CACHE
│   ├── Redis para sessões
│   ├── Cache de consultas
│   ├── CDN para assets
│   └── Browser caching
├── 🐳 CONTAINERS
│   ├── Multi-stage builds
│   ├── Resource limits
│   ├── Health checks
│   └── Auto-scaling
└── 🌐 NETWORK
    ├── Gzip compression
    ├── HTTP/2
    ├── Keep-alive
    └── Rate limiting
```

---

*Especificações técnicas criadas em: ${new Date().toLocaleDateString('pt-BR')}*
*Foco: VPS ICP MAX - Otimização e Performance* 