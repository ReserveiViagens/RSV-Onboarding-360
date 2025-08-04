FROM python:3.11-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements
COPY backend/data/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código
COPY backend/data .
COPY backend/shared shared
RUN pip install --no-cache-dir shared

# Expor portas
EXPOSE 8028

# Comando para executar
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8028"] 