FROM python:3.11-slim

WORKDIR /app

COPY backend/visa/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/visa .
COPY backend/shared shared
RUN pip install --no-cache-dir shared

# Create upload directory
RUN mkdir -p visa_documents

EXPOSE 8017

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8017"] 