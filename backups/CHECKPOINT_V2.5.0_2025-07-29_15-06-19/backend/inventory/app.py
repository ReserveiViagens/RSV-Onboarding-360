from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.shared.config.database import SessionLocal
from backend.shared.models.inventory_item import InventoryItem as InventoryModel
from backend.shared.schemas import InventoryItem, InventoryItemCreate

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/inventory", response_model=list[InventoryItem])
async def get_all_inventory(db: Session = Depends(get_db)):
    return db.query(InventoryModel).all()

@app.post("/inventory/", response_model=InventoryItem)
def create_inventory(item: InventoryItemCreate, db: Session = Depends(get_db)):
    db_item = InventoryModel(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/inventory/{item_id}", response_model=InventoryItem)
async def get_inventory_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(InventoryModel).filter(InventoryModel.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return db_item

@app.put("/inventory/{item_id}", response_model=InventoryItem)
def update_inventory_item(item_id: int, item: InventoryItemCreate, db: Session = Depends(get_db)):
    db_item = db.query(InventoryModel).filter(InventoryModel.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    for key, val in item.dict().items():
        setattr(db_item, key, val)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/inventory/{item_id}", response_model=InventoryItem)
def delete_inventory_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(InventoryModel).filter(InventoryModel.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    db.delete(db_item)
    db.commit()
    return db_item

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5012) 