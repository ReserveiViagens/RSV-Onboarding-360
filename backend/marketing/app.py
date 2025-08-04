from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import logging

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Marketing Service", version="1.0.0")

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class MarketingCampaignBase(BaseModel):
    name: str
    description: Optional[str] = None
    budget: float
    start_date: datetime
    end_date: datetime
    status: str = "active"

class MarketingCampaignCreate(MarketingCampaignBase):
    pass

class MarketingCampaign(MarketingCampaignBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Dados mock para demonstração
campaigns_db = [
    {
        "id": 1,
        "name": "Campanha de Verão 2024",
        "description": "Promoções especiais para viagens de verão",
        "budget": 50000.0,
        "start_date": datetime(2024, 6, 1),
        "end_date": datetime(2024, 8, 31),
        "status": "active",
        "created_at": datetime(2024, 5, 1)
    },
    {
        "id": 2,
        "name": "Black Friday Turismo",
        "description": "Ofertas especiais para Black Friday",
        "budget": 75000.0,
        "start_date": datetime(2024, 11, 20),
        "end_date": datetime(2024, 11, 30),
        "status": "planned",
        "created_at": datetime(2024, 10, 1)
    }
]

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "marketing", "version": "1.0.0"}

@app.get("/campaigns/", response_model=List[MarketingCampaign])
async def get_all_campaigns():
    """Get all marketing campaigns"""
    return campaigns_db

@app.post("/campaigns/", response_model=MarketingCampaign)
def create_campaign(campaign: MarketingCampaignCreate):
    """Create a new marketing campaign"""
    new_campaign = {
        "id": len(campaigns_db) + 1,
        **campaign.dict(),
        "created_at": datetime.utcnow()
    }
    campaigns_db.append(new_campaign)
    return new_campaign

@app.get("/campaigns/{campaign_id}", response_model=MarketingCampaign)
async def get_campaign(campaign_id: int):
    """Get a specific marketing campaign"""
    for campaign in campaigns_db:
        if campaign["id"] == campaign_id:
            return campaign
    raise HTTPException(status_code=404, detail="Campaign not found")

@app.put("/campaigns/{campaign_id}", response_model=MarketingCampaign)
def update_campaign(campaign_id: int, campaign: MarketingCampaignCreate):
    """Update a marketing campaign"""
    for i, existing_campaign in enumerate(campaigns_db):
        if existing_campaign["id"] == campaign_id:
            updated_campaign = {
                **existing_campaign,
                **campaign.dict(),
                "id": campaign_id
            }
            campaigns_db[i] = updated_campaign
            return updated_campaign
    raise HTTPException(status_code=404, detail="Campaign not found")

@app.delete("/campaigns/{campaign_id}")
def delete_campaign(campaign_id: int):
    """Delete a marketing campaign"""
    for i, campaign in enumerate(campaigns_db):
        if campaign["id"] == campaign_id:
            deleted_campaign = campaigns_db.pop(i)
            return {"message": "Campaign deleted successfully", "campaign": deleted_campaign}
    raise HTTPException(status_code=404, detail="Campaign not found")

@app.get("/stats/")
def get_marketing_stats():
    """Get marketing statistics"""
    total_campaigns = len(campaigns_db)
    active_campaigns = len([c for c in campaigns_db if c["status"] == "active"])
    total_budget = sum(c["budget"] for c in campaigns_db)
    
    return {
        "total_campaigns": total_campaigns,
        "active_campaigns": active_campaigns,
        "total_budget": total_budget,
        "average_budget": total_budget / total_campaigns if total_campaigns > 0 else 0
    }

@app.get("/health/")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "marketing"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000) 