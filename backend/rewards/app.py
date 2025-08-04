from fastapi import FastAPI

app = FastAPI(title="Rewards Service", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "Rewards Service is running!", "status": "active"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "rewards", "version": "1.0.0"}

@app.get("/rewards/")
def get_rewards():
    return {"message": "Rewards endpoint", "data": []}

@app.get("/api/status")
def api_status():
    return {
        "service": "rewards",
        "status": "running",
        "version": "1.0.0",
        "endpoints": ["/", "/health", "/rewards/", "/api/status"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8013) 