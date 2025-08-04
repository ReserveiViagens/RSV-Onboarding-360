from fastapi import FastAPI

app = FastAPI(title="SEO Service", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "SEO Service is running!", "status": "active"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "seo", "version": "1.0.0"}

@app.get("/seo/")
def get_seo():
    return {"message": "SEO endpoint", "data": []}

@app.get("/api/status")
def api_status():
    return {
        "service": "seo",
        "status": "running",
        "version": "1.0.0",
        "endpoints": ["/", "/health", "/seo/", "/api/status"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8008) 