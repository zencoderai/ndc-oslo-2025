#!/bin/bash

echo "Starting NDC Oslo 2025 Conference Website..."
echo "Building and starting containers..."

docker-compose up -d

echo ""
echo "Application started successfully!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"