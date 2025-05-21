# NDC Oslo 2025 Conference Website

A full-stack web application for the NDC Oslo 2025 conference, featuring talk submissions and viewing capabilities.

## Project Structure

```
ndc-oslo-2025/
├── frontend/            # React frontend application
├── backend/             # FastAPI backend application
└── docker-compose.yml   # Docker Compose configuration
```

## Features

- Conference information page
- Talk submission form for speakers
- Gallery of submitted talks
- Full responsive design
- RESTful API for talk management
- PostgreSQL database for data storage

## Technologies Used

- **Frontend:** React, React Router, Axios
- **Backend:** FastAPI, SQLAlchemy, Pydantic
- **Database:** PostgreSQL
- **Containerization:** Docker, Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose installed on your machine

### Running the Application

1. Clone this repository
2. Navigate to the project directory
3. Start the application with Docker Compose:

```bash
docker-compose up -d
```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Development

To run the application in development mode:

#### Frontend

```bash
cd frontend
npm install
npm start
```

#### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## API Endpoints

- `GET /api/talks` - List all talks
- `POST /api/talks` - Submit a new talk
- `GET /api/talks/{talk_id}` - Get a specific talk

## Database Schema

The application uses a PostgreSQL database with the following schema:

- **talks** table:
  - id (PK)
  - title
  - speaker_name
  - speaker_email
  - speaker_bio
  - description
  - category
  - level
  - created_at
  - updated_at