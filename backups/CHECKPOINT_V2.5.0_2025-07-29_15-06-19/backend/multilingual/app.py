from fastapi import FastAPI

app = FastAPI(title="Multilingual Service", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "Multilingual Service is running!", "status": "active"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "multilingual", "version": "1.0.0"}

@app.get("/translations/")
def get_translations():
    return {"message": "Translations endpoint", "data": []}

@app.get("/api/status")
def api_status():
    return {
        "service": "multilingual",
        "status": "running",
        "version": "1.0.0",
        "endpoints": ["/", "/health", "/translations/", "/api/status"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8009) 