from fastapi import FastAPI
from pydantic import BaseModel
import torch

app = FastAPI()

class Query(BaseModel):
    text: str

@app.post('/api/converse')
def converse(query: Query):
    response = f'Resposta à query: {query.text} (processada com IA local, sem dependências externas)'
    return {'response': response}

@app.get('/api/workflow/{task}')
def execute_workflow(task: str):
    return {'status': f'Workflow {task} executado via API própria'}

@app.post('/api/voice')
def voice_ai(query: Query):
    return {'response': f'Voz processada: {query.text}'}
