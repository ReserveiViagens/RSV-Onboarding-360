from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

app = FastAPI(title="Test Server - Onion RSV 360")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 1800

@app.get("/")
def read_root():
    return {"message": "Onion RSV 360 - Test Server"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "core"}

@app.post("/api/core/token")
def login(login_data: LoginRequest):
    # Simular autenticação
    if login_data.email == "admin@onion360.com" and login_data.password == "admin123":
        return TokenResponse(
            access_token="test-token-123",
            refresh_token="test-refresh-123"
        )
    elif login_data.email == "demo@onionrsv.com" and login_data.password == "demo123":
        return TokenResponse(
            access_token="demo-token-456",
            refresh_token="demo-refresh-456"
        )
    else:
        return {"error": "Credenciais inválidas"}

@app.post("/api/users/")
def create_user(user_data: dict):
    return {"message": "Usuário criado com sucesso", "email": user_data.get("email")}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000, reload=True) 