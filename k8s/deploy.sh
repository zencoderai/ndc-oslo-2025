#!/bin/bash

# Create namespace first
kubectl apply -f namespace.yaml

# Apply ConfigMap and Secret
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml

# Apply database resources
kubectl apply -f postgres.yaml

# Wait for database to be ready
echo "Waiting for database to be ready..."
kubectl wait --for=condition=ready pod -l app=db -n conference-app --timeout=120s

# Apply backend and frontend
kubectl apply -f backend.yaml
kubectl apply -f frontend.yaml

# Apply monitoring
kubectl apply -f monitoring.yaml

# Apply ingress
kubectl apply -f ingress.yaml

echo "Deployment completed!"
echo "Access the application at: http://conference-app.example.com"
echo "Access Grafana at: http://monitoring.conference-app.example.com"