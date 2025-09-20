from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.shared.config.database import SessionLocal
from backend.shared.models.ticket import Ticket as TicketModel
from backend.shared.schemas import Ticket, TicketCreate

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/tickets", response_model=list[Ticket])
async def get_all_tickets(db: Session = Depends(get_db)):
    return db.query(TicketModel).all()

@app.post("/tickets/", response_model=Ticket)
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):
    db_ticket = TicketModel(**ticket.dict())
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

@app.get("/tickets/{ticket_id}", response_model=Ticket)
async def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    t = db.query(TicketModel).filter(TicketModel.id == ticket_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return t

@app.put("/tickets/{ticket_id}", response_model=Ticket)
def update_ticket(ticket_id: int, ticket: TicketCreate, db: Session = Depends(get_db)):
    db_ticket = db.query(TicketModel).filter(TicketModel.id == ticket_id).first()
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    for key, val in ticket.dict().items():
        setattr(db_ticket, key, val)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

@app.delete("/tickets/{ticket_id}", response_model=Ticket)
def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    db_ticket = db.query(TicketModel).filter(TicketModel.id == ticket_id).first()
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    db.delete(db_ticket)
    db.commit()
    return db_ticket

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5006) 