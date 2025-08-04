# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the requirements file into the container at /usr/src/app
RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*
COPY backend/ecommerce/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ecommerce .
COPY backend/shared shared
RUN pip install --no-cache-dir shared

# Make port 5007 available to the world outside this container
EXPOSE 5007

# Run app.py when the container launches
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5007", "--reload"] 