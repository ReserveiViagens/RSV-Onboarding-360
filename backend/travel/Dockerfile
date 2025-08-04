# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /usr/src/app/backend/travel
# Instala dependências do Travel
COPY backend/travel/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia código do travel e pacote shared
COPY backend/travel .
COPY backend/shared shared

# Registra shared como pacote Python
RUN pip install --no-cache-dir shared

# Make port 5003 available to the world outside this container
EXPOSE 5003

# Run app.py when the container launches
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5003", "--reload"] 