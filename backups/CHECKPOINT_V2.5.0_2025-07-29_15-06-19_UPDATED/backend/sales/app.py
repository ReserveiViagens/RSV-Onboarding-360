from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.shared.config.database import SessionLocal
from backend.shared.models.sale import Sale as SaleModel
from backend.shared.schemas import Sale, SaleCreate

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/sales", response_model=list[Sale])
async def get_all_sales(db: Session = Depends(get_db)):
    return db.query(SaleModel).all()

@app.post("/sales/", response_model=Sale)
def create_sale(sale: SaleCreate, db: Session = Depends(get_db)):
    db_sale = SaleModel(**sale.dict())
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale

@app.get("/sales/{sale_id}", response_model=Sale)
async def get_sale(sale_id: int, db: Session = Depends(get_db)):
    s = db.query(SaleModel).filter(SaleModel.id == sale_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Sale not found")
    return s

@app.put("/sales/{sale_id}", response_model=Sale)
def update_sale(sale_id: int, sale: SaleCreate, db: Session = Depends(get_db)):
    db_sale = db.query(SaleModel).filter(SaleModel.id == sale_id).first()
    if not db_sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    for key, value in sale.dict().items():
        setattr(db_sale, key, value)
    db.commit()
    db.refresh(db_sale)
    return db_sale

@app.delete("/sales/{sale_id}", response_model=Sale)
def delete_sale(sale_id: int, db: Session = Depends(get_db)):
    db_sale = db.query(SaleModel).filter(SaleModel.id == sale_id).first()
    if not db_sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    db.delete(db_sale)
    db.commit()
    return db_sale

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5013) 