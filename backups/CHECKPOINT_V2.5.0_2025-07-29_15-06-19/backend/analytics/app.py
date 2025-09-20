from fastapi import FastAPI

app = FastAPI(title="Analytics Service", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "Analytics Service is running!", "status": "active"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "analytics", "version": "1.0.0"}

@app.get("/analytics/")
def get_analytics():
    return {"message": "Analytics endpoint", "data": []}

@app.get("/api/status")
def api_status():
    return {
        "service": "analytics",
        "status": "running",
        "version": "1.0.0",
        "endpoints": ["/", "/health", "/analytics/", "/api/status"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8007) 