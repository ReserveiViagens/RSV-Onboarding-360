from fastapi import FastAPI

app = FastAPI(title="Coupons Service", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "Coupons Service is running!", "status": "active"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "coupons", "version": "1.0.0"}

@app.get("/coupons/")
def get_coupons():
    return {"message": "Coupons endpoint", "data": []}

@app.get("/api/status")
def api_status():
    return {
        "service": "coupons",
        "status": "running",
        "version": "1.0.0",
        "endpoints": ["/", "/health", "/coupons/", "/api/status"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8012) 