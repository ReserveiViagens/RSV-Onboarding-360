FROM python:3.11-slim

WORKDIR /app

# Instalar dependências do sistema para Pillow
RUN apt-get update && apt-get install -y \
    libjpeg-dev \
    libpng-dev \
    libgif-dev \
    libwebp-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Criar diretórios para uploads
RUN mkdir -p uploads thumbnails medium large

EXPOSE 8024

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8024"] 