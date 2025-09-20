from fastapi import FastAPI

app = FastAPI(title="Groups Service", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "Groups Service is running!", "status": "active"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "groups", "version": "1.0.0"}

@app.get("/groups/")
def get_groups():
    return {"message": "Groups endpoint", "data": []}

@app.get("/api/status")
def api_status():
    return {
        "service": "groups",
        "status": "running",
        "version": "1.0.0",
        "endpoints": ["/", "/health", "/groups/", "/api/status"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8015) 