import uuid
from sqlalchemy import create_engine, Column, String, Float, Integer, DateTime, Text, ARRAY, JSONB, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from app.core.config import get_settings

settings = get_settings()

engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class CallerNumber(Base):
    __tablename__ = "caller_numbers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=lambda: str(uuid.uuid4()))
    phone_number = Column(String(20), unique=True, nullable=False, index=True)
    country_code = Column(String(5), default="+91")
    reputation_score = Column(Float, default=0.5)
    report_count = Column(Integer, default=0)
    scam_type_distribution = Column(JSONB, default={})
    sources = Column(ARRAY(Text), default=[])
    first_reported_at = Column(DateTime, nullable=True)
    last_reported_at = Column(DateTime, nullable=True)
    last_risk_score = Column(Float, nullable=True)
    last_scam_label = Column(String(50), nullable=True)
    analysis_cache = Column(JSONB, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class CallFeedback(Base):
    __tablename__ = "call_feedback"

    id = Column(UUID(as_uuid=True), primary_key=True, default=lambda: str(uuid.uuid4()))
    call_id = Column(String(100), nullable=False)
    phone_number = Column(String(20), nullable=True)
    predicted_risk_score = Column(Float, nullable=True)
    predicted_scam_label = Column(String(50), nullable=True)
    user_confirmed_scam = Column(String(10), nullable=True)
    user_notes = Column(Text, nullable=True)
    audio_hash = Column(String(64), nullable=True)
    transcript = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ScamScript(Base):
    __tablename__ = "scam_scripts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=lambda: str(uuid.uuid4()))
    template_name = Column(String(100), unique=True, nullable=False)
    scam_type = Column(String(50), nullable=False)
    script_text = Column(Text, nullable=False)
    language = Column(String(10), default="hi-en")
    hit_count = Column(Integer, default=0)
    embedding = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


async def init_db():
    """Initialize database tables."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """Get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()