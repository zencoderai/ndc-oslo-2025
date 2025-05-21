from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base

class Talk(Base):
    __tablename__ = "talks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    speaker_name = Column(String(255), nullable=False)
    speaker_email = Column(String(255), nullable=False)
    speaker_bio = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)
    level = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())