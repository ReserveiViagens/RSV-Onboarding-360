# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Define working directory específico do Tickets Service
WORKDIR /usr/src/app/backend/tickets

# Instala dependências do serviço
COPY backend/tickets/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia código do serviço e do pacote compartilhado
COPY backend/tickets .
COPY backend/shared shared

# Registra shared como pacote Python
RUN pip install --no-cache-dir shared

# Porta e comando de inicialização
EXPOSE 5006
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5006", "--reload"] 