#!/bin/bash

echo "🔍 QUICK STATUS CHECK"
echo "===================="
echo ""

# MySQL
if ps aux | grep -i mysql | grep -v grep > /dev/null; then
    echo "✅ MySQL: Running"
else
    echo "❌ MySQL: Not Running"
fi

# Backend
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Backend: Running (http://localhost:3001)"
else
    echo "❌ Backend: Not Running"
fi

# Frontend
if lsof -ti:5173 > /dev/null 2>&1; then
    echo "✅ Frontend: Running (http://localhost:5173)"
else
    echo "❌ Frontend: Not Running"
fi

# Data
DOCTORS=$(curl -s http://localhost:3001/api/doctors 2>/dev/null | jq 'length' 2>/dev/null)
if [ "$DOCTORS" -gt 0 ] 2>/dev/null; then
    echo "✅ Database: $DOCTORS doctors, data available"
else
    echo "⚠️  Database: No data or connection issue"
fi

echo ""
echo "🚀 Access: http://localhost:5173"
echo "🔑 Login: patient@test.com / patient123"
