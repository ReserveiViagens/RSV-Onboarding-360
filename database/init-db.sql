-- 🐘 INICIALIZAÇÃO DO BANCO DE DADOS - ONION RSV 360
-- Script para criação de bancos, usuários e otimizações

-- =============================================================================
-- EXTENSÕES NECESSÁRIAS
-- =============================================================================

-- Extensões para performance e monitoramento
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS auto_explain;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Extensões para dados geográficos (para mapas e localização)
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Extensões para full-text search (para busca de conteúdo)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- =============================================================================
-- CRIAÇÃO DE USUÁRIOS DO SISTEMA
-- =============================================================================

-- Usuários para Core Services
CREATE USER core_user WITH PASSWORD 'core_secure_2024!';
CREATE USER travel_user WITH PASSWORD 'travel_secure_2024!';
CREATE USER finance_user WITH PASSWORD 'finance_secure_2024!';
CREATE USER tickets_user WITH PASSWORD 'tickets_secure_2024!';

-- Usuários para Business Services
CREATE USER payments_user WITH PASSWORD 'payments_secure_2024!';
CREATE USER ecommerce_user WITH PASSWORD 'ecommerce_secure_2024!';
CREATE USER vouchers_user WITH PASSWORD 'vouchers_secure_2024!';
CREATE USER attractions_user WITH PASSWORD 'attractions_secure_2024!';

-- Usuários para Analytics & Reports
CREATE USER analytics_user WITH PASSWORD 'analytics_secure_2024!';
CREATE USER reports_user WITH PASSWORD 'reports_secure_2024!';
CREATE USER data_user WITH PASSWORD 'data_secure_2024!';

-- Usuários para User Services
CREATE USER users_user WITH PASSWORD 'users_secure_2024!';
CREATE USER notifications_user WITH PASSWORD 'notifications_secure_2024!';
CREATE USER reviews_user WITH PASSWORD 'reviews_secure_2024!';

-- Usuários administrativos
CREATE USER replicator WITH REPLICATION PASSWORD 'replication_secure_2024!';
CREATE USER backup_user WITH PASSWORD 'backup_secure_2024!';
CREATE USER monitor_user WITH PASSWORD 'monitor_secure_2024!';

-- =============================================================================
-- CRIAÇÃO DOS BANCOS DE DADOS
-- =============================================================================

-- Core Services Databases
CREATE DATABASE onion_core OWNER core_user;
CREATE DATABASE onion_travel OWNER travel_user;
CREATE DATABASE onion_finance OWNER finance_user;
CREATE DATABASE onion_tickets OWNER tickets_user;

-- Business Services Databases
CREATE DATABASE onion_payments OWNER payments_user;
CREATE DATABASE onion_ecommerce OWNER ecommerce_user;
CREATE DATABASE onion_vouchers OWNER vouchers_user;
CREATE DATABASE onion_attractions OWNER attractions_user;

-- Analytics & Reports Databases
CREATE DATABASE onion_analytics OWNER analytics_user;
CREATE DATABASE onion_reports OWNER reports_user;
CREATE DATABASE onion_data_warehouse OWNER data_user;

-- User Services Databases
CREATE DATABASE onion_users OWNER users_user;
CREATE DATABASE onion_notifications OWNER notifications_user;
CREATE DATABASE onion_reviews OWNER reviews_user;

-- =============================================================================
-- CONFIGURAÇÕES POR BANCO DE DADOS
-- =============================================================================

-- Configurar cada banco com otimizações específicas

\c onion_core;
-- Extensões para o core
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c onion_travel;
-- Extensões para viagens (dados geográficos)
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

\c onion_finance;
-- Extensões para finanças (precisão decimal)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

\c onion_analytics;
-- Extensões para analytics (agregações)
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

\c onion_ecommerce;
-- Extensões para e-commerce (busca e localização)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS postgis;

-- =============================================================================
-- TABELAS DE CONFIGURAÇÃO GLOBAL
-- =============================================================================

\c postgres;

-- Tabela para configurações do sistema
CREATE TABLE IF NOT EXISTS system_config (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(50) NOT NULL,
    config_key VARCHAR(100) NOT NULL,
    config_value TEXT,
    environment VARCHAR(20) DEFAULT 'development',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(service_name, config_key, environment)
);

-- Inserir configurações iniciais
INSERT INTO system_config (service_name, config_key, config_value, environment) VALUES
('core', 'max_connections_per_service', '20', 'development'),
('core', 'connection_timeout', '30', 'development'),
('analytics', 'batch_size', '1000', 'development'),
('analytics', 'aggregation_interval', '300', 'development'),
('payments', 'transaction_timeout', '60', 'development'),
('payments', 'max_retry_attempts', '3', 'development');

-- =============================================================================
-- ÍNDICES DE PERFORMANCE
-- =============================================================================

-- Índices para tabela de configuração
CREATE INDEX IF NOT EXISTS idx_system_config_service ON system_config(service_name);
CREATE INDEX IF NOT EXISTS idx_system_config_key ON system_config(config_key);
CREATE INDEX IF NOT EXISTS idx_system_config_env ON system_config(environment);

-- =============================================================================
-- FUNÇÕES UTILITÁRIAS
-- =============================================================================

-- Função para atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Função para gerar UUIDs v4
CREATE OR REPLACE FUNCTION generate_uuid_v4()
RETURNS UUID AS $$
BEGIN
    RETURN uuid_generate_v4();
END;
$$ language 'plpgsql';

-- Função para limpar dados antigos (para manutenção)
CREATE OR REPLACE FUNCTION cleanup_old_data(table_name TEXT, days_old INTEGER)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    EXECUTE format('DELETE FROM %I WHERE created_at < NOW() - INTERVAL ''%s days''', 
                   table_name, days_old);
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ language 'plpgsql';

-- =============================================================================
-- PERMISSÕES DE SEGURANÇA
-- =============================================================================

-- Permissões para usuários de serviço (apenas seus próprios bancos)
GRANT CONNECT ON DATABASE onion_core TO core_user;
GRANT CONNECT ON DATABASE onion_travel TO travel_user;
GRANT CONNECT ON DATABASE onion_finance TO finance_user;
GRANT CONNECT ON DATABASE onion_tickets TO tickets_user;
GRANT CONNECT ON DATABASE onion_payments TO payments_user;
GRANT CONNECT ON DATABASE onion_ecommerce TO ecommerce_user;
GRANT CONNECT ON DATABASE onion_vouchers TO vouchers_user;
GRANT CONNECT ON DATABASE onion_attractions TO attractions_user;
GRANT CONNECT ON DATABASE onion_analytics TO analytics_user;
GRANT CONNECT ON DATABASE onion_reports TO reports_user;
GRANT CONNECT ON DATABASE onion_data_warehouse TO data_user;
GRANT CONNECT ON DATABASE onion_users TO users_user;
GRANT CONNECT ON DATABASE onion_notifications TO notifications_user;
GRANT CONNECT ON DATABASE onion_reviews TO reviews_user;

-- Permissões para usuário de monitoramento (read-only)
GRANT CONNECT ON DATABASE postgres, onion_core, onion_travel, onion_finance TO monitor_user;
GRANT SELECT ON ALL TABLES IN SCHEMA information_schema TO monitor_user;
GRANT SELECT ON pg_stat_activity, pg_stat_database, pg_stat_user_tables TO monitor_user;

-- Permissões para backup
GRANT CONNECT ON ALL DATABASES TO backup_user;

-- =============================================================================
-- CONFIGURAÇÕES DE MONITORAMENTO
-- =============================================================================

-- Habilitar coleta de estatísticas
ALTER SYSTEM SET track_activities = on;
ALTER SYSTEM SET track_counts = on;
ALTER SYSTEM SET track_io_timing = on;
ALTER SYSTEM SET track_functions = 'all';

-- Configurar pg_stat_statements
ALTER SYSTEM SET pg_stat_statements.max = 10000;
ALTER SYSTEM SET pg_stat_statements.track = 'all';

-- =============================================================================
-- VIEWS DE MONITORAMENTO
-- =============================================================================

-- View para monitorar conexões por serviço
CREATE OR REPLACE VIEW service_connections AS
SELECT 
    datname as database_name,
    usename as user_name,
    application_name,
    client_addr,
    COUNT(*) as connection_count,
    MAX(backend_start) as last_connection
FROM pg_stat_activity 
WHERE datname IS NOT NULL
GROUP BY datname, usename, application_name, client_addr
ORDER BY connection_count DESC;

-- View para queries mais lentas
CREATE OR REPLACE VIEW slow_queries AS
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows,
    100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements 
ORDER BY mean_time DESC;

-- =============================================================================
-- JOBS DE MANUTENÇÃO
-- =============================================================================

-- Nota: Em produção, configurar cron jobs para:
-- 1. VACUUM ANALYZE automático
-- 2. Backup diário
-- 3. Limpeza de logs antigos
-- 4. Monitoramento de espaço em disco

SELECT 'Database initialization completed successfully!' AS status;