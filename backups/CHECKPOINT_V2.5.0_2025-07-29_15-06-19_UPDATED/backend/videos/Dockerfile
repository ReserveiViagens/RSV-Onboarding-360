FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Criar diretórios para uploads
RUN mkdir -p uploads thumbnails

EXPOSE 8023

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8023"] 