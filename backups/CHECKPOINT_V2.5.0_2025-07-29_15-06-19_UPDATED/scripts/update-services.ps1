# Script para atualizar todos os serviços do Onion RSV 360
Write-Host "Atualizando todos os serviços..." -ForegroundColor Yellow

# Lista de serviços para atualizar
$services = @(
    "analytics-service",
    "attractions-service", 
    "chatbots-service",
    "coupons-service",
    "ecommerce-service",
    "finance-service",
    "giftcards-service",
    "loyalty-service",
    "notifications-service",
    "parks-service",
    "photos-service",
    "reviews-service",
    "rewards-service",
    "sales-service",
    "seo-service",
    "tickets-service",
    "videos-service"
)

# Atualizar cada serviço
foreach ($service in $services) {
    Write-Host "Atualizando $service..." -ForegroundColor Cyan
    docker-compose -f docker-compose.dev.yml up --build -d $service
    Start-Sleep -Seconds 2
}

Write-Host "Todos os serviços foram atualizados!" -ForegroundColor Green
Write-Host "Verificando status dos serviços..." -ForegroundColor Yellow

# Verificar status
docker-compose -f docker-compose.dev.yml ps

Write-Host "Atualizacao concluida!" -ForegroundColor Green 