FROM python:3.11-slim

WORKDIR /app

COPY backend/videos/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/videos .
COPY backend/shared shared
RUN pip install --no-cache-dir shared

# Criar diretórios para uploads
RUN mkdir -p uploads thumbnails

EXPOSE 8023

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8023"] 