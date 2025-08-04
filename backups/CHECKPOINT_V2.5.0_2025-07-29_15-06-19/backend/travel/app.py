from fastapi import FastAPI

app = FastAPI(title="Travel Service", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "Travel Service is running!", "status": "active"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "travel", "version": "1.0.0"}

@app.get("/flights/")
def get_flights():
    return {"message": "Flights endpoint", "data": []}

@app.get("/hotels/")
def get_hotels():
    return {"message": "Hotels endpoint", "data": []}

@app.get("/api/status")
def api_status():
    return {
        "service": "travel",
        "status": "running",
        "version": "1.0.0",
        "endpoints": ["/", "/health", "/flights/", "/hotels/", "/api/status"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5003) 