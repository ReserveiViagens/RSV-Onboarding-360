from fastapi import FastAPI

app = FastAPI(title="Subscriptions Service", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "Subscriptions Service is running!", "status": "active"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "subscriptions", "version": "1.0.0"}

@app.get("/subscriptions/")
def get_subscriptions():
    return {"message": "Subscriptions endpoint", "data": []}

@app.get("/api/status")
def api_status():
    return {
        "service": "subscriptions",
        "status": "running",
        "version": "1.0.0",
        "endpoints": ["/", "/health", "/subscriptions/", "/api/status"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8010) 