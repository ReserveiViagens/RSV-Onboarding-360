#!/bin/bash
# 🔧 Setup PostgreSQL Otimizado - Onion RSV 360

set -e

echo "🚀 Iniciando configuração otimizada do PostgreSQL..."

# Configurar timezone
export TZ=America/Sao_Paulo

# Aguardar PostgreSQL estar pronto
until pg_isready -h localhost -p 5432 -U postgres; do
    echo "⏳ Aguardando PostgreSQL estar pronto..."
    sleep 2
done

echo "✅ PostgreSQL está pronto!"

# Configurar shared_preload_libraries se necessário
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Configurações adicionais de runtime
    ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements,auto_explain';
    
    -- Configurações de memória dinâmicas
    ALTER SYSTEM SET effective_cache_size = '3GB';
    ALTER SYSTEM SET shared_buffers = '1GB';
    
    -- Configurações de WAL
    ALTER SYSTEM SET wal_buffers = '16MB';
    ALTER SYSTEM SET max_wal_size = '2GB';
    
    -- Configurações de autovacuum
    ALTER SYSTEM SET autovacuum_max_workers = 6;
    ALTER SYSTEM SET autovacuum_naptime = '30s';
    
    -- Configurações de logging
    ALTER SYSTEM SET log_min_duration_statement = 1000;
    ALTER SYSTEM SET log_checkpoints = on;
    
    -- Aplicar configurações
    SELECT pg_reload_conf();
EOSQL

echo "🔧 Configurações de sistema aplicadas!"

# Criar estrutura de monitoramento
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Tabela para histórico de performance
    CREATE TABLE IF NOT EXISTS performance_history (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        total_connections INTEGER,
        active_connections INTEGER,
        database_size BIGINT,
        cache_hit_ratio DECIMAL(5,2),
        transactions_per_sec DECIMAL(10,2),
        slow_queries_count INTEGER
    );
    
    -- Função para coletar métricas
    CREATE OR REPLACE FUNCTION collect_performance_metrics()
    RETURNS VOID AS \$\$
    DECLARE
        total_conn INTEGER;
        active_conn INTEGER;
        db_size BIGINT;
        cache_ratio DECIMAL(5,2);
        tps DECIMAL(10,2);
        slow_queries INTEGER;
    BEGIN
        -- Coletar métricas
        SELECT count(*) INTO total_conn FROM pg_stat_activity;
        SELECT count(*) INTO active_conn FROM pg_stat_activity WHERE state = 'active';
        SELECT pg_database_size('postgres') INTO db_size;
        
        SELECT 
            ROUND(100.0 * sum(blks_hit) / sum(blks_hit + blks_read), 2)
        INTO cache_ratio
        FROM pg_stat_database;
        
        SELECT 
            ROUND(sum(xact_commit + xact_rollback)::decimal / 
                  EXTRACT(epoch FROM (now() - stats_reset)), 2)
        INTO tps
        FROM pg_stat_database 
        WHERE datname = 'postgres';
        
        SELECT count(*) INTO slow_queries 
        FROM pg_stat_statements 
        WHERE mean_time > 1000;
        
        -- Inserir no histórico
        INSERT INTO performance_history 
        (total_connections, active_connections, database_size, 
         cache_hit_ratio, transactions_per_sec, slow_queries_count)
        VALUES (total_conn, active_conn, db_size, cache_ratio, tps, slow_queries);
        
        -- Limpar registros antigos (manter apenas 7 dias)
        DELETE FROM performance_history 
        WHERE timestamp < NOW() - INTERVAL '7 days';
    END;
    \$\$ LANGUAGE plpgsql;
EOSQL

echo "📊 Sistema de monitoramento configurado!"

# Configurar log rotation
cat > /etc/logrotate.d/postgresql <<EOF
/var/log/postgresql/*.log {
    daily
    missingok
    rotate 7
    compress
    notifempty
    create 0644 postgres postgres
    postrotate
        systemctl reload postgresql || true
    endscript
}
EOF

echo "📝 Log rotation configurado!"

# Otimizações finais
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Analisar todas as tabelas para otimizar planner
    ANALYZE;
    
    -- Vacuum full inicial
    VACUUM;
    
    -- Reindexar sistema
    REINDEX DATABASE postgres;
EOSQL

echo "🏁 Setup PostgreSQL otimizado concluído com sucesso!"

# Mostrar status final
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -c "
SELECT 
    'PostgreSQL Otimizado' as status,
    version() as version,
    current_setting('shared_buffers') as shared_buffers,
    current_setting('effective_cache_size') as effective_cache_size,
    current_setting('max_connections') as max_connections;
"