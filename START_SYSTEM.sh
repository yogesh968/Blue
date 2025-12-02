#!/bin/bash

echo "🚀 Starting Healthcare Portal System..."
echo ""

# Check if backend is already running
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Backend already running on port 3001"
else
    echo "🔧 Starting Backend Server..."
    cd backend
    npm start &
    BACKEND_PID=$!
    echo "✅ Backend started (PID: $BACKEND_PID)"
    cd ..
fi

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
sleep 3

# Test backend
echo "🧪 Testing backend..."
curl -s http://localhost:3001/api/health > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend is responding"
else
    echo "❌ Backend is not responding"
fi

echo ""
echo "📊 System Status:"
echo "  Backend: http://localhost:3001"
echo "  Frontend: http://localhost:5173 (start manually with: cd frontend && npm run dev)"
echo ""
echo "🔑 Test Credentials:"
echo "  Doctor: sarah.johnson@hospital.com / doctor123"
echo "  Patient: patient@test.com / patient123"
echo ""
echo "✅ System Ready!"
