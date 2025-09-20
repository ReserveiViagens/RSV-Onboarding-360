# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy code
COPY . .

# Expose port
EXPOSE 5014

# Run the service
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5014", "--reload"] 