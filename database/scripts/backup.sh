#!/bin/bash
# 💾 Backup PostgreSQL - Onion RSV 360

set -e

# Configurações
BACKUP_DIR="/var/lib/postgresql/backup"
ARCHIVE_DIR="/var/lib/postgresql/archive"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
RETENTION_DAYS=7

echo "🗄️ Iniciando backup do PostgreSQL - $TIMESTAMP"

# Criar diretório de backup se não existir
mkdir -p "$BACKUP_DIR"
mkdir -p "$ARCHIVE_DIR"

# Lista de bancos para backup
DATABASES=("postgres" "onion_core" "onion_travel" "onion_finance" "onion_tickets" 
           "onion_payments" "onion_ecommerce" "onion_vouchers" "onion_attractions"
           "onion_analytics" "onion_reports" "onion_data_warehouse" 
           "onion_users" "onion_notifications" "onion_reviews")

# Backup de cada banco
for db in "${DATABASES[@]}"; do
    if psql -lqt | cut -d \| -f 1 | grep -qw "$db"; then
        echo "📦 Fazendo backup de $db..."
        
        # Backup completo comprimido
        pg_dump -h localhost -U postgres -d "$db" \
            --verbose --clean --no-owner --no-privileges \
            | gzip > "$BACKUP_DIR/${db}_${TIMESTAMP}.sql.gz"
        
        echo "✅ Backup de $db concluído"
    else
        echo "⚠️ Banco $db não existe, pulando..."
    fi
done

# Backup global (roles, tablespaces, etc.)
echo "🌐 Fazendo backup global..."
pg_dumpall -h localhost -U postgres --globals-only \
    | gzip > "$BACKUP_DIR/globals_${TIMESTAMP}.sql.gz"

# Backup das configurações
echo "⚙️ Fazendo backup das configurações..."
tar -czf "$BACKUP_DIR/configs_${TIMESTAMP}.tar.gz" \
    /etc/postgresql/postgresql.conf \
    /etc/postgresql/pg_hba.conf \
    2>/dev/null || echo "⚠️ Algumas configurações não foram encontradas"

# Verificar integridade dos backups
echo "🔍 Verificando integridade dos backups..."
for backup_file in "$BACKUP_DIR"/*_${TIMESTAMP}.sql.gz; do
    if [ -f "$backup_file" ]; then
        if gzip -t "$backup_file"; then
            echo "✅ $backup_file está íntegro"
        else
            echo "❌ $backup_file está corrompido!"
            exit 1
        fi
    fi
done

# Limpeza de backups antigos
echo "🧹 Limpando backups antigos (mais de $RETENTION_DAYS dias)..."
find "$BACKUP_DIR" -name "*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete

# Limpeza de WAL files antigos
echo "🧹 Limpando WAL files antigos..."
find "$ARCHIVE_DIR" -name "*.backup" -type f -mtime +$RETENTION_DAYS -delete

# Estatísticas do backup
backup_size=$(du -sh "$BACKUP_DIR" | cut -f1)
backup_count=$(ls -1 "$BACKUP_DIR"/*_${TIMESTAMP}.* 2>/dev/null | wc -l)

echo "📊 Backup concluído!"
echo "   • Timestamp: $TIMESTAMP"
echo "   • Arquivos criados: $backup_count"
echo "   • Tamanho total: $backup_size"
echo "   • Localização: $BACKUP_DIR"

# Log do backup
echo "$(date): Backup concluído - $backup_count arquivos, $backup_size" >> "$BACKUP_DIR/backup.log"

# Teste de restore (opcional)
if [ "$1" = "--test-restore" ]; then
    echo "🧪 Testando restore do backup..."
    
    # Criar banco temporário para teste
    createdb -h localhost -U postgres test_restore_db || true
    
    # Testar restore do core
    if [ -f "$BACKUP_DIR/onion_core_${TIMESTAMP}.sql.gz" ]; then
        gunzip -c "$BACKUP_DIR/onion_core_${TIMESTAMP}.sql.gz" | \
            psql -h localhost -U postgres -d test_restore_db > /dev/null 2>&1
        
        if [ $? -eq 0 ]; then
            echo "✅ Teste de restore bem-sucedido"
        else
            echo "❌ Teste de restore falhou"
        fi
    fi
    
    # Remover banco de teste
    dropdb -h localhost -U postgres test_restore_db || true
fi

echo "🎉 Backup PostgreSQL concluído com sucesso!"