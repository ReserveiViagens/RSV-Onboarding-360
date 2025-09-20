# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /usr/src/app/backend/finance
# Instala dependências do Finance
COPY backend/finance/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia código do finance e pacote shared
COPY backend/finance .
COPY backend/shared shared

# Registra shared como pacote Python
RUN pip install --no-cache-dir shared

# Make port 5005 available to the world outside this container
EXPOSE 5005

# Run app.py when the container launches
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5005", "--reload"] 