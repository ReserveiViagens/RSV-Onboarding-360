from fastapi import FastAPI
from datetime import datetime
import logging

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI App
app = FastAPI(title="Travel Service", version="1.0.0")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "travel", "version": "1.0.0"}

@app.get("/")
async def root():
    return {
        "message": "Travel Service is running!", 
        "timestamp": datetime.now(),
        "status": "active"
    }

@app.get("/api/status")
def api_status():
    return {
        "service": "travel",
        "status": "running",
        "version": "1.0.0",
        "endpoints": ["/", "/health", "/api/status"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5003)