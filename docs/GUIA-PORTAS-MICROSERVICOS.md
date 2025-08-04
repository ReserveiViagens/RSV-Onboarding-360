# 🔗 GUIA COMPLETO DE PORTAS - MICROSERVIÇOS ONION RSV 360

## 📋 **MAPEAMENTO COMPLETO DE PORTAS**

### **🎯 RESUMO EXECUTIVO**

- **32 microserviços** operacionais
- **Portas 5000-5034** utilizadas
- **Mapeamento Docker** configurado
- **Health checks** em todas as portas

---

## 🚀 **LISTA COMPLETA DE MICROSERVIÇOS E PORTAS**

| #   | Serviço              | Porta Externa | Porta Interna | Container                      | Status |
| --- | -------------------- | ------------- | ------------- | ------------------------------ | ------ |
| 1   | **core**             | 5000          | 5000          | servidorrsv-core-1             | ✅     |
| 2   | **travel**           | 5003          | 5003          | servidorrsv-travel-1           | ✅     |
| 3   | **finance**          | 5005          | 5005          | servidorrsv-finance-1          | ✅     |
| 4   | **tickets**          | 5006          | 5006          | servidorrsv-tickets-1          | ✅     |
| 5   | **payments**         | 5007          | 5005          | servidorrsv-payments-1         | ✅     |
| 6   | **ecommerce**        | 5008          | 5007          | servidorrsv-ecommerce-1        | ✅     |
| 7   | **attractions**      | 5009          | 5009          | servidorrsv-attractions-1      | ✅     |
| 8   | **vouchers**         | 5010          | 5028          | servidorrsv-vouchers-1         | ✅     |
| 9   | **voucher-editor**   | 5011          | 5029          | servidorrsv-voucher-editor-1   | ✅     |
| 10  | **giftcards**        | 5012          | 5028          | servidorrsv-giftcards-1        | ✅     |
| 11  | **coupons**          | 5013          | 8012          | servidorrsv-coupons-1          | ✅     |
| 12  | **parks**            | 5014          | 5008          | servidorrsv-parks-1            | ✅     |
| 13  | **maps**             | 5015          | 8022          | servidorrsv-maps-1             | ✅     |
| 14  | **visa**             | 5016          | 8017          | servidorrsv-visa-1             | ✅     |
| 15  | **marketing**        | 5017          | 5014          | servidorrsv-marketing-1        | ✅     |
| 16  | **subscriptions**    | 5018          | 8010          | servidorrsv-subscriptions-1    | ✅     |
| 17  | **seo**              | 5019          | 8008          | servidorrsv-seo-1              | ✅     |
| 18  | **multilingual**     | 5020          | 8009          | servidorrsv-multilingual-1     | ✅     |
| 19  | **videos**           | 5021          | 8023          | servidorrsv-videos-1           | ✅     |
| 20  | **photos**           | 5022          | 8024          | servidorrsv-photos-1           | ✅     |
| 21  | **admin**            | 5023          | 8025          | servidorrsv-admin-1            | ✅     |
| 22  | **analytics**        | 5024          | 8026          | servidorrsv-analytics-1        | ✅     |
| 23  | **reports**          | 5025          | 8027          | servidorrsv-reports-1          | ✅     |
| 24  | **data**             | 5026          | 8028          | servidorrsv-data-1             | ✅     |
| 25  | **notifications**    | 5027          | 8029          | servidorrsv-notifications-1    | ✅     |
| 26  | **reviews**          | 5028          | 8030          | servidorrsv-reviews-1          | ✅     |
| 27  | **rewards**          | 5029          | 8031          | servidorrsv-rewards-1          | ✅     |
| 28  | **loyalty**          | 5030          | 8032          | servidorrsv-loyalty-1          | ✅     |
| 29  | **sales**            | 5031          | 8033          | servidorrsv-sales-1            | ✅     |
| 30  | **sectoral_finance** | 5032          | 8034          | servidorrsv-sectoral_finance-1 | ✅     |
| 31  | **refunds**          | 5033          | 8035          | servidorrsv-refunds-1          | ✅     |
| 32  | **inventory**        | 5034          | 8036          | servidorrsv-inventory-1        | ✅     |

---

## 🧪 **COMANDOS DE TESTE RÁPIDO**

### **Teste Individual de Serviços**

```bash
# Core Services
curl http://localhost:5000/health  # core
curl http://localhost:5003/health  # travel
curl http://localhost:5005/health  # finance
curl http://localhost:5006/health  # tickets
curl http://localhost:5009/health  # attractions

# Business Services
curl http://localhost:5007/health  # payments
curl http://localhost:5008/health  # ecommerce
curl http://localhost:5010/health  # vouchers
curl http://localhost:5011/health  # voucher-editor
curl http://localhost:5012/health  # giftcards
curl http://localhost:5013/health  # coupons

# Specialized Services
curl http://localhost:5014/health  # parks
curl http://localhost:5015/health  # maps
curl http://localhost:5016/health  # visa
curl http://localhost:5017/health  # marketing
curl http://localhost:5018/health  # subscriptions
curl http://localhost:5019/health  # seo
curl http://localhost:5020/health  # multilingual
curl http://localhost:5021/health  # videos
curl http://localhost:5022/health  # photos

# Management Systems
curl http://localhost:5023/health  # admin
curl http://localhost:5024/health  # analytics
curl http://localhost:5025/health  # reports
curl http://localhost:5026/health  # data

# User Services
curl http://localhost:5027/health  # notifications
curl http://localhost:5028/health  # reviews
curl http://localhost:5029/health  # rewards
curl http://localhost:5030/health  # loyalty

# Business Operations
curl http://localhost:5031/health  # sales
curl http://localhost:5032/health  # sectoral_finance
curl http://localhost:5033/health  # refunds
curl http://localhost:5034/health  # inventory
```

### **Script de Teste Completo (PowerShell)**

```powershell
$services = @(
    "core:5000", "travel:5003", "finance:5005", "tickets:5006",
    "attractions:5009", "payments:5007", "ecommerce:5008",
    "vouchers:5010", "voucher-editor:5011", "giftcards:5012",
    "coupons:5013", "parks:5014", "maps:5015", "visa:5016",
    "marketing:5017", "subscriptions:5018", "seo:5019",
    "multilingual:5020", "videos:5021", "photos:5022",
    "admin:5023", "analytics:5024", "reports:5025", "data:5026",
    "notifications:5027", "reviews:5028", "rewards:5029",
    "loyalty:5030", "sales:5031", "sectoral_finance:5032",
    "refunds:5033", "inventory:5034"
)

$working = 0
$total = $services.Count

Write-Host "🧪 TESTANDO $total MICROSERVIÇOS..." -ForegroundColor Yellow

foreach ($service in $services) {
    $name, $port = $service -split ":"
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$port/health" -TimeoutSec 5 -ErrorAction Stop
        Write-Host "✅ $($name.PadRight(20)) | FUNCIONANDO" -ForegroundColor Green
        $working++
    } catch {
        Write-Host "❌ $($name.PadRight(20)) | FALHOU" -ForegroundColor Red
    }
}

if ($working -eq $total) {
    Write-Host "`n🏆 SISTEMA 100% OPERACIONAL! 🏆" -ForegroundColor Green
} else {
    Write-Host "`n📊 RESULTADO: $working/$total microserviços funcionando" -ForegroundColor Yellow
}
```

---

## 🔧 **CONFIGURAÇÃO DOCKER COMPOSE**

### **Exemplo de Configuração de Porta**

```yaml
services:
  core:
    build:
      context: .
      dockerfile: backend/core/Dockerfile
    ports:
      - "5000:5000" # porta_externa:porta_interna
    command: uvicorn app:app --host 0.0.0.0 --port 5000
```

### **Verificar Mapeamento Atual**

```bash
# Ver todos os containers e suas portas
docker compose ps

# Ver apenas as portas
docker compose ps --format "table {{.Name}}\t{{.Ports}}"
```

---

## 🚨 **RESOLUÇÃO DE PROBLEMAS DE PORTA**

### **Problema: Porta em uso**

```bash
# Windows - Verificar processo na porta
netstat -ano | findstr :5000

# Parar processo
taskkill /F /PID [PID]
```

### **Problema: Serviço não responde**

```bash
# Verificar se container está rodando
docker ps | grep nome-do-servico

# Verificar logs
docker compose logs nome-do-servico

# Restart específico
docker compose restart nome-do-servico
```

### **Problema: Conflito de mapeamento**

1. Verificar `docker-compose.yml`
2. Confirmar se porta externa está livre
3. Ajustar mapeamento se necessário
4. Rebuildar: `docker compose up nome-do-servico -d`

---

## 📈 **MONITORAMENTO DE PORTAS**

### **Script de Monitoramento Contínuo**

```powershell
while ($true) {
    Clear-Host
    Write-Host "🔄 MONITORAMENTO CONTÍNUO - $(Get-Date)" -ForegroundColor Cyan

    $services = @("core:5000", "travel:5003", "finance:5005")  # Lista completa...
    $working = 0

    foreach ($service in $services) {
        $name, $port = $service -split ":"
        try {
            Invoke-WebRequest -Uri "http://localhost:$port/health" -TimeoutSec 2 -ErrorAction Stop | Out-Null
            Write-Host "✅ $name" -ForegroundColor Green
            $working++
        } catch {
            Write-Host "❌ $name" -ForegroundColor Red
        }
    }

    Write-Host "`nStatus: $working/$($services.Count) funcionando" -ForegroundColor Yellow
    Start-Sleep 10
}
```

---

## 🎯 **CONFIGURAÇÕES RECOMENDADAS**

### **Para Desenvolvimento**

- Use `localhost` em vez de `127.0.0.1`
- Timeout de 5-10 segundos para health checks
- Aguarde 30-60 segundos após `docker compose up`

### **Para Produção**

- Configure load balancer na frente
- Use HTTPS (porta 443)
- Implemente rate limiting
- Configure firewall adequadamente

---

**📚 Este guia garante acesso correto a todos os 32 microserviços do sistema Onion RSV 360!**
