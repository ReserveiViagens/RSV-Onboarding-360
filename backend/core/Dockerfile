FROM python:3.11-slim

WORKDIR /usr/src/app/backend/core
# Instala dependências do Core
COPY backend/core/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia código do core e pacote shared
COPY backend/core .
COPY backend/shared shared

# Registra shared como pacote Python
RUN pip install --no-cache-dir shared

# Expor porta
EXPOSE 5000

# Comando para executar
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000", "--reload"] 