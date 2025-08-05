# 🌐 Nginx Load Balancer - Onion RSV 360
FROM nginx:1.25-alpine

# Instalar dependências úteis
RUN apk add --no-cache \
    curl \
    bash \
    htop \
    && rm -rf /var/cache/apk/*

# Copiar configuração personalizada
COPY nginx.conf /etc/nginx/nginx.conf

# Criar diretórios necessários
RUN mkdir -p /var/log/nginx /var/cache/nginx

# Criar página de erro personalizada
RUN echo '<!DOCTYPE html><html><head><title>Onion RSV 360 - Service Unavailable</title></head><body><h1>Service Temporarily Unavailable</h1><p>Please try again in a few moments.</p></body></html>' > /usr/share/nginx/html/50x.html

# Criar script de health check
RUN echo '#!/bin/bash\ncurl -f http://localhost:8080/health || exit 1' > /usr/local/bin/health-check.sh \
    && chmod +x /usr/local/bin/health-check.sh

# Expor portas
EXPOSE 80 443 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD /usr/local/bin/health-check.sh

# Comando padrão
CMD ["nginx", "-g", "daemon off;"]