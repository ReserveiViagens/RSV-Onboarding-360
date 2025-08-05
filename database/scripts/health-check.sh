#!/bin/bash
# 🏥 Health Check PostgreSQL - Onion RSV 360

set -e

# Verificar se PostgreSQL está respondendo
pg_isready -h localhost -p 5432 -U postgres -q

# Verificar se consegue executar queries simples
psql -h localhost -p 5432 -U postgres -d postgres -c "SELECT 1;" > /dev/null 2>&1

# Verificar extensões críticas
psql -h localhost -p 5432 -U postgres -d postgres -c "SELECT 1 FROM pg_extension WHERE extname = 'pg_stat_statements';" > /dev/null 2>&1

echo "PostgreSQL healthy"
exit 0