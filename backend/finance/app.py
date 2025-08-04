from fastapi import FastAPI

app = FastAPI(title="Finance Service", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "Finance Service is running!", "status": "active"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "finance", "version": "1.0.0"}

@app.get("/transactions/")
def get_transactions():
    return {"message": "Transactions endpoint", "data": []}

@app.get("/accounts/")
def get_accounts():
    return {"message": "Accounts endpoint", "data": []}

@app.get("/api/status")
def api_status():
    return {
        "service": "finance",
        "status": "running",
        "version": "1.0.0",
        "endpoints": ["/", "/health", "/transactions/", "/accounts/", "/api/status"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5005) 