# 🐘 PostgreSQL Otimizado - Onion RSV 360
FROM postgres:15-alpine

# Metadados
LABEL maintainer="Onion RSV 360 Team"
LABEL description="PostgreSQL otimizado para sistema de turismo"
LABEL version="15.0-optimized"

# Variáveis de ambiente
ENV POSTGRES_DB=postgres
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=onion_rsv_360_secure!
ENV PGDATA=/var/lib/postgresql/data/pgdata

# Instalar extensões e ferramentas úteis
RUN apk add --no-cache \
    postgis \
    postgresql-contrib \
    curl \
    bash \
    htop \
    && rm -rf /var/cache/apk/*

# Criar diretórios necessários
RUN mkdir -p /var/lib/postgresql/archive \
    && mkdir -p /var/lib/postgresql/backup \
    && mkdir -p /var/log/postgresql \
    && chown -R postgres:postgres /var/lib/postgresql/archive \
    && chown -R postgres:postgres /var/lib/postgresql/backup \
    && chown -R postgres:postgres /var/log/postgresql

# Copiar configurações otimizadas
COPY postgresql.conf /etc/postgresql/postgresql.conf
COPY pg_hba.conf /etc/postgresql/pg_hba.conf

# Copiar script de inicialização
COPY init-db.sql /docker-entrypoint-initdb.d/01-init-db.sql

# Script de configuração personalizada
COPY --chmod=755 scripts/setup-postgres.sh /docker-entrypoint-initdb.d/02-setup.sh

# Script de health check
COPY --chmod=755 scripts/health-check.sh /usr/local/bin/health-check.sh

# Script de backup
COPY --chmod=755 scripts/backup.sh /usr/local/bin/backup.sh

# Configurar PostgreSQL para usar nossas configurações
RUN echo "# Include custom configuration" >> /usr/local/share/postgresql/postgresql.conf.sample \
    && echo "include '/etc/postgresql/postgresql.conf'" >> /usr/local/share/postgresql/postgresql.conf.sample

# Expor porta padrão
EXPOSE 5432

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD /usr/local/bin/health-check.sh

# Volume para dados
VOLUME ["/var/lib/postgresql/data", "/var/lib/postgresql/archive", "/var/lib/postgresql/backup"]

# Comando padrão
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf", "-c", "hba_file=/etc/postgresql/pg_hba.conf"]