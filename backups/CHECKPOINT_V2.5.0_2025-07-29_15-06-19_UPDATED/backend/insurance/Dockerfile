FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create upload directory
RUN mkdir -p insurance_documents

EXPOSE 8018

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8018"] 