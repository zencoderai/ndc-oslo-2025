from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class TalkBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=255)
    speaker_name: str = Field(..., min_length=2, max_length=255)
    speaker_email: EmailStr
    speaker_bio: str = Field(..., min_length=10)
    description: str = Field(..., min_length=10)
    category: str = Field(..., pattern="^(web|mobile|cloud|ai|security|data|architecture|other)$")
    level: str = Field(..., pattern="^(beginner|intermediate|advanced)$")

class TalkCreate(TalkBase):
    pass

class TalkResponse(TalkBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True