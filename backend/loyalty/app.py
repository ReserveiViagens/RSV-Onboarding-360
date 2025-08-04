from fastapi import FastAPI

app = FastAPI(title="Loyalty Service", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "Loyalty Service is running!", "status": "active"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "loyalty", "version": "1.0.0"}

@app.get("/loyalty/")
def get_loyalty():
    return {"message": "Loyalty endpoint", "data": []}

@app.get("/api/status")
def api_status():
    return {
        "service": "loyalty",
        "status": "running",
        "version": "1.0.0",
        "endpoints": ["/", "/health", "/loyalty/", "/api/status"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8014) 