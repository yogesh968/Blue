#!/bin/bash

echo "🧪 Testing Healthcare API Endpoints..."
echo ""

# Test registration
echo "1. Testing Registration..."
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "testuser@example.com", 
    "password": "password123",
    "phone": "1234567890",
    "role": "PATIENT"
  }' | jq '.'

echo ""
echo "2. Testing Login..."
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }' | jq '.'

echo ""
echo "3. Testing Doctors List..."
curl -X GET http://localhost:3001/api/doctors | jq '.'