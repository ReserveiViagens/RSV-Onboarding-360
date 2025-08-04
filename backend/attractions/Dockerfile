# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Define working directory específico do Attractions Service
WORKDIR /usr/src/app/backend/attractions

# Instala dependências do serviço
COPY backend/attractions/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia código do serviço e do pacote compartilhado
COPY backend/attractions .
COPY backend/shared shared

# Registra shared como pacote Python
RUN pip install --no-cache-dir shared

# Porta e comando de inicialização
EXPOSE 5009
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5009", "--reload"] 