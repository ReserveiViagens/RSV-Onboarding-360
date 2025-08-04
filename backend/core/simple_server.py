from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from urllib.parse import urlparse, parse_qs

class SimpleHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = {"status": "healthy", "service": "core"}
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = {"message": "Onion RSV 360 - Simple Server"}
            self.wfile.write(json.dumps(response).encode())

    def do_POST(self):
        if self.path == '/api/core/token':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Simular autenticação
            if data.get('email') == 'admin@onion360.com' and data.get('password') == 'admin123':
                response = {
                    "access_token": "test-token-123",
                    "refresh_token": "test-refresh-123",
                    "token_type": "bearer",
                    "expires_in": 1800
                }
                status = 200
            elif data.get('email') == 'demo@onionrsv.com' and data.get('password') == 'demo123':
                response = {
                    "access_token": "demo-token-456",
                    "refresh_token": "demo-refresh-456",
                    "token_type": "bearer",
                    "expires_in": 1800
                }
                status = 200
            else:
                response = {"error": "Credenciais inválidas"}
                status = 401
            
            self.send_response(status)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == '__main__':
    server = HTTPServer(('localhost', 5000), SimpleHandler)
    print("🚀 Servidor iniciado em http://localhost:5000")
    print("📋 Endpoints disponíveis:")
    print("   GET  /health - Status do servidor")
    print("   POST /api/core/token - Login")
    print("   GET  / - Página inicial")
    server.serve_forever() 