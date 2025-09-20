# 🚀 SCRIPT DE INICIALIZAÇÃO LOCAL SIMPLIFICADO
# RSV 360° ECOSYSTEM - Ambiente de Produção Local

Write-Host "🏭 RSV 360° ECOSYSTEM - INICIALIZAÇÃO LOCAL" -ForegroundColor Magenta
Write-Host "================================================" -ForegroundColor Magenta

# Verificar se Docker está rodando
Write-Host "🔍 Verificando Docker..." -ForegroundColor Blue
try {
    docker info | Out-Null
    Write-Host "✅ Docker está rodando" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker não está rodando. Inicie o Docker Desktop primeiro." -ForegroundColor Red
    exit 1
}

# Parar containers existentes
Write-Host "🛑 Parando containers existentes..." -ForegroundColor Yellow
docker-compose -f docker-compose.local.yml down 2>$null

# Iniciar banco de dados e Redis
Write-Host "🗄️ Iniciando banco de dados e Redis..." -ForegroundColor Blue
docker-compose -f docker-compose.local.yml up -d db-local redis-local

# Aguardar banco estar pronto
Write-Host "⏳ Aguardando banco de dados..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Iniciar todos os serviços
Write-Host "🚀 Iniciando todos os serviços..." -ForegroundColor Blue
docker-compose -f docker-compose.local.yml up -d

# Aguardar serviços iniciarem
Write-Host "⏳ Aguardando serviços iniciarem..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Mostrar status
Write-Host "📊 Status dos containers:" -ForegroundColor Blue
docker-compose -f docker-compose.local.yml ps

# Mostrar URLs
Write-Host ""
Write-Host "🌐 URLs DE ACESSO:" -ForegroundColor Cyan
Write-Host "🏠 Ecosystem Master:    http://localhost:3000" -ForegroundColor White
Write-Host "📈 Grafana Dashboard:   http://localhost:3005" -ForegroundColor White
Write-Host "🔍 Prometheus:          http://localhost:9090" -ForegroundColor White
Write-Host "🗄️ Database:           localhost:5432" -ForegroundColor White
Write-Host "🔴 Redis:               localhost:6379" -ForegroundColor White

Write-Host ""
Write-Host "🔐 CREDENCIAIS:" -ForegroundColor Yellow
Write-Host "Database - User: rsvuser, Password: rsvpassword" -ForegroundColor White
Write-Host "Grafana - User: admin, Password: rsvadmin2025" -ForegroundColor White

Write-Host ""
Write-Host "🎉 AMBIENTE LOCAL INICIADO COM SUCESSO!" -ForegroundColor Green
Write-Host "📊 Para ver logs: docker-compose -f docker-compose.local.yml logs -f" -ForegroundColor Blue
Write-Host "🛑 Para parar: docker-compose -f docker-compose.local.yml down" -ForegroundColor Blue