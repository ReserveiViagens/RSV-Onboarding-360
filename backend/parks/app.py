from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from shared.config.database import SessionLocal
from shared.models.park import Park as ParkModel
from shared.schemas import Park, ParkCreate
from datetime import datetime

app = FastAPI()

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "parks", "timestamp": datetime.now().isoformat(), "version": "1.0.0"}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/parks", response_model=list[Park])
async def get_all_parks(db: Session = Depends(get_db)):
    return db.query(ParkModel).all()

@app.post("/parks/", response_model=Park)
def create_park(park: ParkCreate, db: Session = Depends(get_db)):
    db_park = ParkModel(**park.dict())
    db.add(db_park)
    db.commit()
    db.refresh(db_park)
    return db_park

@app.get("/parks/{park_id}", response_model=Park)
async def get_park(park_id: int, db: Session = Depends(get_db)):
    db_park = db.query(ParkModel).filter(ParkModel.id == park_id).first()
    if not db_park:
        raise HTTPException(status_code=404, detail="Park not found")
    return db_park

@app.put("/parks/{park_id}", response_model=Park)
def update_park(park_id: int, park: ParkCreate, db: Session = Depends(get_db)):
    db_park = db.query(ParkModel).filter(ParkModel.id == park_id).first()
    if not db_park:
        raise HTTPException(status_code=404, detail="Park not found")
    for key, val in park.dict().items():
        setattr(db_park, key, val)
    db.commit()
    db.refresh(db_park)
    return db_park

@app.delete("/parks/{park_id}", response_model=Park)
def delete_park(park_id: int, db: Session = Depends(get_db)):
    db_park = db.query(ParkModel).filter(ParkModel.id == park_id).first()
    if not db_park:
        raise HTTPException(status_code=404, detail="Park not found")
    db.delete(db_park)
    db.commit()
    return db_park

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5008) 