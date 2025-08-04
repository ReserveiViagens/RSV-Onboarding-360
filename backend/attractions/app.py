import sys
import os

# Adiciona raiz do projeto ao path para imports relativos
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from shared.config.database import get_db
from shared.models.attraction import Attraction as AttractionModel
from shared.schemas import Attraction, AttractionCreate

app = FastAPI()

@app.get("/attractions", response_model=list[Attraction])
async def get_all_attractions(db: Session = Depends(get_db)):
    return db.query(AttractionModel).all()

@app.post("/attractions/", response_model=Attraction)
def create_attraction(attraction: AttractionCreate, db: Session = Depends(get_db)):
    db_item = AttractionModel(**attraction.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/attractions/{attraction_id}", response_model=Attraction)
async def get_attraction(attraction_id: int, db: Session = Depends(get_db)):
    item = db.query(AttractionModel).filter(AttractionModel.id == attraction_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Attraction not found")
    return item

@app.put("/attractions/{attraction_id}", response_model=Attraction)
def update_attraction(attraction_id: int, attraction: AttractionCreate, db: Session = Depends(get_db)):
    db_item = db.query(AttractionModel).filter(AttractionModel.id == attraction_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Attraction not found")
    for key, value in attraction.dict().items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/attractions/{attraction_id}", response_model=Attraction)
def delete_attraction(attraction_id: int, db: Session = Depends(get_db)):
    db_item = db.query(AttractionModel).filter(AttractionModel.id == attraction_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Attraction not found")
    db.delete(db_item)
    db.commit()
    return db_item

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "attractions", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5009) 