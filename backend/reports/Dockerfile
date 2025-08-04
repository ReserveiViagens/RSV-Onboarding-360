FROM python:3.11-slim

WORKDIR /app

COPY backend/reports/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/reports .
COPY backend/shared shared
RUN pip install --no-cache-dir shared

EXPOSE 8027
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8027"]