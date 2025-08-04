from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Chatbot(Base):
    __tablename__ = "chatbots"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    chatbot_type = Column(String(50), nullable=False)
    model_name = Column(String(100), nullable=True)
    api_key = Column(String(500), nullable=True)
    webhook_url = Column(String(500), nullable=True)
    welcome_message = Column(Text, nullable=True)
    fallback_message = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    language = Column(String(10), default="pt-BR")
    timezone = Column(String(50), default="America/Sao_Paulo")
    settings = Column(JSON, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ChatbotSession(Base):
    __tablename__ = "chatbot_sessions"
    id = Column(Integer, primary_key=True, index=True)
    chatbot_id = Column(Integer, ForeignKey("chatbots.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_id = Column(String(100), nullable=False, unique=True)
    platform = Column(String(50), nullable=True)
    user_agent = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)
    status = Column(String(20), default="active")
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    total_messages = Column(Integer, default=0)
    user_satisfaction = Column(Integer, nullable=True)

class ChatbotMessage(Base):
    __tablename__ = "chatbot_messages"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chatbot_sessions.id"), nullable=False)
    message_type = Column(String(20), nullable=False)
    content = Column(Text, nullable=False)
    sender = Column(String(20), nullable=False)
    intent_detected = Column(String(100), nullable=True)
    confidence_score = Column(Float, nullable=True)
    response_time_ms = Column(Integer, nullable=True)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatbotIntent(Base):
    __tablename__ = "chatbot_intents"
    id = Column(Integer, primary_key=True, index=True)
    chatbot_id = Column(Integer, ForeignKey("chatbots.id"), nullable=False)
    intent_name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    training_phrases = Column(JSON, nullable=True)
    responses = Column(JSON, nullable=True)
    parameters = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True)
    priority = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ChatbotResponse(Base):
    __tablename__ = "chatbot_responses"
    id = Column(Integer, primary_key=True, index=True)
    chatbot_id = Column(Integer, ForeignKey("chatbots.id"), nullable=False)
    intent_id = Column(Integer, ForeignKey("chatbot_intents.id"), nullable=True)
    response_type = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    conditions = Column(JSON, nullable=True)
    is_default = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ChatbotTraining(Base):
    __tablename__ = "chatbot_trainings"
    id = Column(Integer, primary_key=True, index=True)
    chatbot_id = Column(Integer, ForeignKey("chatbots.id"), nullable=False)
    training_data = Column(JSON, nullable=False)
    model_version = Column(String(50), nullable=True)
    accuracy_score = Column(Float, nullable=True)
    training_status = Column(String(20), default="pending")
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    training_logs = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)

class ChatbotAnalytics(Base):
    __tablename__ = "chatbot_analytics"
    id = Column(Integer, primary_key=True, index=True)
    chatbot_id = Column(Integer, ForeignKey("chatbots.id"), nullable=False)
    date = Column(DateTime, nullable=False)
    total_sessions = Column(Integer, default=0)
    total_messages = Column(Integer, default=0)
    unique_users = Column(Integer, default=0)
    avg_session_duration = Column(Float, default=0.0)
    avg_messages_per_session = Column(Float, default=0.0)
    intent_accuracy = Column(Float, default=0.0)
    user_satisfaction_avg = Column(Float, default=0.0)
    fallback_rate = Column(Float, default=0.0)
    response_time_avg = Column(Float, default=0.0)
    top_intents = Column(JSON, nullable=True)
    platform_distribution = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow) 