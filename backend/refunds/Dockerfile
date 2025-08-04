FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create upload directory
RUN mkdir -p refund_documents

EXPOSE 8019

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8019"] 