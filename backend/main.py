from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.orm import Session
from typing import List
import os
import logging

from database import get_db, init_db
from models import Talk
from schemas import TalkCreate, TalkResponse
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI(title="NDC Oslo 2025 API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Prometheus metrics
instrumentator = Instrumentator(
    should_group_status_codes=True,
    should_ignore_untemplated=True,
    should_respect_env_var=True,
    should_instrument_requests_inprogress=True,
    excluded_handlers=[".*admin.*", "/metrics"],
    env_var_name="ENABLE_METRICS",
    inprogress_name="inprogress",
    inprogress_labels=True,
)
# Instrument the app immediately rather than in startup event
instrumentator.instrument(app).expose(app, include_in_schema=True, should_gzip=True)

# Add a custom exception handler for validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Custom handler for validation errors that provides clearer error messages
    """
    import logging
    logging.error(f"Validation error: {exc.errors()}")
    
    # Format errors for better readability
    formatted_errors = []
    for error in exc.errors():
        loc = " -> ".join([str(l) for l in error.get("loc", [])])
        msg = error.get("msg", "")
        formatted_errors.append(f"{loc}: {msg}")
    
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation error", "errors": formatted_errors},
    )

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

@app.get("/")
def read_root():
    return {"message": "Welcome to NDC Oslo 2025 API"}

@app.post("/api/talks", response_model=TalkResponse)
def create_talk(talk: TalkCreate, db: Session = Depends(get_db)):
    """Create a new talk submission"""
    try:
        db_talk = Talk(
            title=talk.title,
            speaker_name=talk.speaker_name,
            speaker_email=talk.speaker_email,
            speaker_bio=talk.speaker_bio,
            description=talk.description,
            category=talk.category,
            level=talk.level
        )
        db.add(db_talk)
        db.commit()
        db.refresh(db_talk)
        return db_talk
    except Exception as e:
        # Log the error for debugging
        import logging
        logging.error(f"Error creating talk: {str(e)}")
        logging.error(f"Talk data: {talk.model_dump()}")
        # Re-raise the exception so FastAPI can handle it
        raise

@app.get("/api/talks", response_model=List[TalkResponse])
def read_talks(
    search: str = None,
    category: str = None,
    level: str = None,
    speaker_name: str = None,
    db: Session = Depends(get_db)
):
    """
    Get all talk submissions with optional filtering
    - search: Search in title and description
    - category: Filter by category
    - level: Filter by level
    - speaker_name: Filter by speaker name
    """
    query = db.query(Talk)
    
    # Apply filters if provided
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Talk.title.ilike(search_term)) | 
            (Talk.description.ilike(search_term)) |
            (Talk.speaker_name.ilike(search_term))
        )
    
    if category:
        query = query.filter(Talk.category == category)
    
    if level:
        query = query.filter(Talk.level == level)
        
    if speaker_name:
        query = query.filter(Talk.speaker_name.ilike(f"%{speaker_name}%"))
    
    talks = query.all()
    return talks

@app.get("/api/talks/{talk_id}", response_model=TalkResponse)
def read_talk(talk_id: int, db: Session = Depends(get_db)):
    """Get a specific talk submission by ID"""
    talk = db.query(Talk).filter(Talk.id == talk_id).first()
    if talk is None:
        raise HTTPException(status_code=404, detail="Talk not found")
    return talk

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)