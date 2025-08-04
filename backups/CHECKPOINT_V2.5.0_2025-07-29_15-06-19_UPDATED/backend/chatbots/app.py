from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
import json
from datetime import datetime, timedelta

from shared.database import get_db, init_db
from shared.models.chatbots import (
    Chatbot, ChatbotSession, ChatbotMessage, ChatbotIntent, 
    ChatbotResponse, ChatbotTraining, ChatbotAnalytics
)
from shared.schemas import (
    ChatbotCreate, ChatbotUpdate, Chatbot as ChatbotSchema,
    ChatbotSessionCreate, ChatbotSessionUpdate, ChatbotSession as ChatbotSessionSchema,
    ChatbotMessageCreate, ChatbotMessage as ChatbotMessageSchema,
    ChatbotIntentCreate, ChatbotIntentUpdate, ChatbotIntent as ChatbotIntentSchema,
    ChatbotResponseCreate, ChatbotResponseUpdate, ChatbotResponse as ChatbotResponseSchema,
    ChatbotTrainingCreate, ChatbotTrainingUpdate, ChatbotTraining as ChatbotTrainingSchema,
    ChatbotAnalyticsCreate, ChatbotAnalytics as ChatbotAnalyticsSchema
)

app = FastAPI(title="Chatbots Service", version="1.0.0")

# Initialize database
init_db()

def generate_session_id():
    """Generate unique session ID"""
    return str(uuid.uuid4())

def detect_intent(message: str, chatbot_id: int, db: Session) -> Optional[str]:
    """Simple intent detection logic"""
    # This is a basic implementation - in production, you'd use NLP libraries
    message_lower = message.lower()
    
    # Get chatbot intents
    intents = db.query(ChatbotIntent).filter(
        ChatbotIntent.chatbot_id == chatbot_id,
        ChatbotIntent.is_active == True
    ).all()
    
    best_match = None
    best_score = 0.0
    
    for intent in intents:
        if intent.training_phrases:
            for phrase in intent.training_phrases:
                if phrase.lower() in message_lower:
                    score = len(phrase) / len(message)
                    if score > best_score:
                        best_score = score
                        best_match = intent.intent_name
    
    return best_match if best_score > 0.3 else None

def get_bot_response(intent_name: str, chatbot_id: int, db: Session) -> str:
    """Get bot response based on intent"""
    # Get default response for the intent
    response = db.query(ChatbotResponse).filter(
        ChatbotResponse.chatbot_id == chatbot_id,
        ChatbotResponse.is_active == True
    ).first()
    
    if not response:
        # Get chatbot fallback message
        chatbot = db.query(Chatbot).filter(Chatbot.id == chatbot_id).first()
        return chatbot.fallback_message if chatbot else "Desculpe, não entendi sua mensagem."
    
    return response.content

@app.post("/chatbots/", response_model=ChatbotSchema)
def create_chatbot(chatbot: ChatbotCreate, db: Session = Depends(get_db)):
    """Create a new chatbot"""
    db_chatbot = Chatbot(**chatbot.dict())
    db.add(db_chatbot)
    db.commit()
    db.refresh(db_chatbot)
    return db_chatbot

@app.get("/chatbots/", response_model=List[ChatbotSchema])
def get_chatbots(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all chatbots"""
    chatbots = db.query(Chatbot).offset(skip).limit(limit).all()
    return chatbots

@app.get("/chatbots/{chatbot_id}", response_model=ChatbotSchema)
def get_chatbot(chatbot_id: int, db: Session = Depends(get_db)):
    """Get a specific chatbot"""
    chatbot = db.query(Chatbot).filter(Chatbot.id == chatbot_id).first()
    if not chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    return chatbot

@app.put("/chatbots/{chatbot_id}", response_model=ChatbotSchema)
def update_chatbot(chatbot_id: int, chatbot: ChatbotUpdate, db: Session = Depends(get_db)):
    """Update a chatbot"""
    db_chatbot = db.query(Chatbot).filter(Chatbot.id == chatbot_id).first()
    if not db_chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    
    for field, value in chatbot.dict(exclude_unset=True).items():
        setattr(db_chatbot, field, value)
    
    db_chatbot.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_chatbot)
    return db_chatbot

@app.delete("/chatbots/{chatbot_id}")
def delete_chatbot(chatbot_id: int, db: Session = Depends(get_db)):
    """Delete a chatbot"""
    chatbot = db.query(Chatbot).filter(Chatbot.id == chatbot_id).first()
    if not chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    
    db.delete(chatbot)
    db.commit()
    return {"message": "Chatbot deleted successfully"}

@app.post("/sessions/", response_model=ChatbotSessionSchema)
def create_session(session: ChatbotSessionCreate, db: Session = Depends(get_db)):
    """Create a new chatbot session"""
    session_data = session.dict()
    session_data["session_id"] = generate_session_id()
    
    db_session = ChatbotSession(**session_data)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

@app.get("/sessions/{session_id}", response_model=ChatbotSessionSchema)
def get_session(session_id: str, db: Session = Depends(get_db)):
    """Get a specific session"""
    session = db.query(ChatbotSession).filter(ChatbotSession.session_id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@app.put("/sessions/{session_id}", response_model=ChatbotSessionSchema)
def update_session(session_id: str, session_update: ChatbotSessionUpdate, db: Session = Depends(get_db)):
    """Update a session"""
    db_session = db.query(ChatbotSession).filter(ChatbotSession.session_id == session_id).first()
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    for field, value in session_update.dict(exclude_unset=True).items():
        setattr(db_session, field, value)
    
    db.commit()
    db.refresh(db_session)
    return db_session

@app.post("/messages/", response_model=ChatbotMessageSchema)
def create_message(message: ChatbotMessageCreate, db: Session = Depends(get_db)):
    """Create a new message"""
    # Get session
    session = db.query(ChatbotSession).filter(ChatbotSession.id == message.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Create user message
    message_data = message.dict()
    db_message = ChatbotMessage(**message_data)
    db.add(db_message)
    
    # Update session message count
    session.total_messages += 1
    
    # If it's a user message, generate bot response
    if message.sender == "user":
        # Detect intent
        intent_detected = detect_intent(message.content, session.chatbot_id, db)
        
        # Get bot response
        bot_response = get_bot_response(intent_detected, session.chatbot_id, db)
        
        # Create bot message
        bot_message = ChatbotMessage(
            session_id=message.session_id,
            message_type="text",
            content=bot_response,
            sender="bot",
            intent_detected=intent_detected,
            confidence_score=0.8 if intent_detected else 0.0,
            response_time_ms=100  # Mock response time
        )
        db.add(bot_message)
        session.total_messages += 1
    
    db.commit()
    db.refresh(db_message)
    return db_message

@app.get("/sessions/{session_id}/messages/", response_model=List[ChatbotMessageSchema])
def get_session_messages(session_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get messages for a session"""
    session = db.query(ChatbotSession).filter(ChatbotSession.session_id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    messages = db.query(ChatbotMessage).filter(
        ChatbotMessage.session_id == session.id
    ).offset(skip).limit(limit).all()
    
    return messages

@app.post("/intents/", response_model=ChatbotIntentSchema)
def create_intent(intent: ChatbotIntentCreate, db: Session = Depends(get_db)):
    """Create a new intent"""
    db_intent = ChatbotIntent(**intent.dict())
    db.add(db_intent)
    db.commit()
    db.refresh(db_intent)
    return db_intent

@app.get("/chatbots/{chatbot_id}/intents/", response_model=List[ChatbotIntentSchema])
def get_chatbot_intents(chatbot_id: int, db: Session = Depends(get_db)):
    """Get intents for a chatbot"""
    intents = db.query(ChatbotIntent).filter(ChatbotIntent.chatbot_id == chatbot_id).all()
    return intents

@app.put("/intents/{intent_id}", response_model=ChatbotIntentSchema)
def update_intent(intent_id: int, intent: ChatbotIntentUpdate, db: Session = Depends(get_db)):
    """Update an intent"""
    db_intent = db.query(ChatbotIntent).filter(ChatbotIntent.id == intent_id).first()
    if not db_intent:
        raise HTTPException(status_code=404, detail="Intent not found")
    
    for field, value in intent.dict(exclude_unset=True).items():
        setattr(db_intent, field, value)
    
    db_intent.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_intent)
    return db_intent

@app.delete("/intents/{intent_id}")
def delete_intent(intent_id: int, db: Session = Depends(get_db)):
    """Delete an intent"""
    intent = db.query(ChatbotIntent).filter(ChatbotIntent.id == intent_id).first()
    if not intent:
        raise HTTPException(status_code=404, detail="Intent not found")
    
    db.delete(intent)
    db.commit()
    return {"message": "Intent deleted successfully"}

@app.post("/responses/", response_model=ChatbotResponseSchema)
def create_response(response: ChatbotResponseCreate, db: Session = Depends(get_db)):
    """Create a new response"""
    db_response = ChatbotResponse(**response.dict())
    db.add(db_response)
    db.commit()
    db.refresh(db_response)
    return db_response

@app.get("/chatbots/{chatbot_id}/responses/", response_model=List[ChatbotResponseSchema])
def get_chatbot_responses(chatbot_id: int, db: Session = Depends(get_db)):
    """Get responses for a chatbot"""
    responses = db.query(ChatbotResponse).filter(ChatbotResponse.chatbot_id == chatbot_id).all()
    return responses

@app.put("/responses/{response_id}", response_model=ChatbotResponseSchema)
def update_response(response_id: int, response: ChatbotResponseUpdate, db: Session = Depends(get_db)):
    """Update a response"""
    db_response = db.query(ChatbotResponse).filter(ChatbotResponse.id == response_id).first()
    if not db_response:
        raise HTTPException(status_code=404, detail="Response not found")
    
    for field, value in response.dict(exclude_unset=True).items():
        setattr(db_response, field, value)
    
    db_response.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_response)
    return db_response

@app.delete("/responses/{response_id}")
def delete_response(response_id: int, db: Session = Depends(get_db)):
    """Delete a response"""
    response = db.query(ChatbotResponse).filter(ChatbotResponse.id == response_id).first()
    if not response:
        raise HTTPException(status_code=404, detail="Response not found")
    
    db.delete(response)
    db.commit()
    return {"message": "Response deleted successfully"}

@app.post("/training/", response_model=ChatbotTrainingSchema)
def create_training(training: ChatbotTrainingCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Create a new training session"""
    db_training = ChatbotTraining(**training.dict())
    db.add(db_training)
    db.commit()
    db.refresh(db_training)
    
    # In a real implementation, you would start training in background
    # background_tasks.add_task(train_chatbot_model, db_training.id)
    
    return db_training

@app.get("/chatbots/{chatbot_id}/training/", response_model=List[ChatbotTrainingSchema])
def get_chatbot_training(chatbot_id: int, db: Session = Depends(get_db)):
    """Get training sessions for a chatbot"""
    training_sessions = db.query(ChatbotTraining).filter(ChatbotTraining.chatbot_id == chatbot_id).all()
    return training_sessions

@app.put("/training/{training_id}", response_model=ChatbotTrainingSchema)
def update_training(training_id: int, training: ChatbotTrainingUpdate, db: Session = Depends(get_db)):
    """Update a training session"""
    db_training = db.query(ChatbotTraining).filter(ChatbotTraining.id == training_id).first()
    if not db_training:
        raise HTTPException(status_code=404, detail="Training session not found")
    
    for field, value in training.dict(exclude_unset=True).items():
        setattr(db_training, field, value)
    
    db.commit()
    db.refresh(db_training)
    return db_training

@app.post("/analytics/", response_model=ChatbotAnalyticsSchema)
def create_analytics(analytics: ChatbotAnalyticsCreate, db: Session = Depends(get_db)):
    """Create analytics data"""
    db_analytics = ChatbotAnalytics(**analytics.dict())
    db.add(db_analytics)
    db.commit()
    db.refresh(db_analytics)
    return db_analytics

@app.get("/chatbots/{chatbot_id}/analytics/", response_model=List[ChatbotAnalyticsSchema])
def get_chatbot_analytics(chatbot_id: int, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None, db: Session = Depends(get_db)):
    """Get analytics for a chatbot"""
    query = db.query(ChatbotAnalytics).filter(ChatbotAnalytics.chatbot_id == chatbot_id)
    
    if start_date:
        query = query.filter(ChatbotAnalytics.date >= start_date)
    if end_date:
        query = query.filter(ChatbotAnalytics.date <= end_date)
    
    analytics = query.all()
    return analytics

@app.get("/chatbots/{chatbot_id}/stats/")
def get_chatbot_stats(chatbot_id: int, db: Session = Depends(get_db)):
    """Get chatbot statistics"""
    # Get total sessions
    total_sessions = db.query(ChatbotSession).filter(ChatbotSession.chatbot_id == chatbot_id).count()
    
    # Get active sessions
    active_sessions = db.query(ChatbotSession).filter(
        ChatbotSession.chatbot_id == chatbot_id,
        ChatbotSession.status == "active"
    ).count()
    
    # Get total messages
    total_messages = db.query(ChatbotMessage).join(ChatbotSession).filter(
        ChatbotSession.chatbot_id == chatbot_id
    ).count()
    
    # Get average satisfaction
    sessions_with_satisfaction = db.query(ChatbotSession).filter(
        ChatbotSession.chatbot_id == chatbot_id,
        ChatbotSession.user_satisfaction.isnot(None)
    ).all()
    
    avg_satisfaction = 0
    if sessions_with_satisfaction:
        avg_satisfaction = sum(s.user_satisfaction for s in sessions_with_satisfaction) / len(sessions_with_satisfaction)
    
    return {
        "total_sessions": total_sessions,
        "active_sessions": active_sessions,
        "total_messages": total_messages,
        "average_satisfaction": avg_satisfaction
    }

@app.get("/health/")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "chatbots"} 