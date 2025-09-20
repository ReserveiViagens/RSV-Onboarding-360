from fastapi import FastAPI

app = FastAPI(title="Gift Cards Service", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "Gift Cards Service is running!", "status": "active"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "giftcards", "version": "1.0.0"}

@app.get("/giftcards/")
def get_giftcards():
    return {"message": "Gift Cards endpoint", "data": []}

@app.get("/api/status")
def api_status():
    return {
        "service": "giftcards",
        "status": "running",
        "version": "1.0.0",
        "endpoints": ["/", "/health", "/giftcards/", "/api/status"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8011) 