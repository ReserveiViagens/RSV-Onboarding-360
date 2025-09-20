FROM python:3.11-slim

WORKDIR /app

COPY backend/maps/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/maps .
COPY backend/shared shared
RUN pip install --no-cache-dir shared

EXPOSE 8022
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8022"] 