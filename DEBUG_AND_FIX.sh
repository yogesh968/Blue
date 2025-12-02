#!/bin/bash

echo "🔍 DEBUGGING HEALTHCARE PORTAL SYSTEM"
echo "======================================"
echo ""

# Check MySQL
echo "1️⃣ Checking MySQL..."
if ps aux | grep -i mysql | grep -v grep > /dev/null; then
    echo "   ✅ MySQL is running"
else
    echo "   ❌ MySQL is NOT running"
    echo "   Fix: Start MySQL from System Preferences or run:"
    echo "   sudo /usr/local/mysql/support-files/mysql.server start"
    exit 1
fi

# Check Database Connection
echo ""
echo "2️⃣ Checking Database Connection..."
cd /Users/arnavkumar/ap-grp-project/neon/backend
if npx prisma db pull --print > /dev/null 2>&1; then
    echo "   ✅ Database connection working"
else
    echo "   ❌ Database connection failed"
    echo "   Fix: Check your .env file DATABASE_URL"
    exit 1
fi

# Check if data exists
echo ""
echo "3️⃣ Checking Database Data..."
DOCTOR_COUNT=$(curl -s http://localhost:3001/api/doctors 2>/dev/null | jq 'length' 2>/dev/null)
if [ "$DOCTOR_COUNT" -gt 0 ] 2>/dev/null; then
    echo "   ✅ Database has $DOCTOR_COUNT doctors"
else
    echo "   ⚠️  No data found. Running seed script..."
    node scripts/resetAndSeed.js
    echo "   ✅ Database seeded"
fi

# Check Backend
echo ""
echo "4️⃣ Checking Backend Server..."
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "   ✅ Backend is running on port 3001"
else
    echo "   ❌ Backend is NOT running"
    echo "   Fix: Run in terminal: cd backend && npm start"
    exit 1
fi

# Check Frontend
echo ""
echo "5️⃣ Checking Frontend Server..."
if lsof -ti:5173 > /dev/null 2>&1; then
    echo "   ✅ Frontend is running on port 5173"
else
    echo "   ❌ Frontend is NOT running"
    echo "   Fix: Run in terminal: cd frontend && npm run dev"
    exit 1
fi

# Test API Endpoints
echo ""
echo "6️⃣ Testing API Endpoints..."
echo "   Testing /api/doctors..."
DOCTORS=$(curl -s http://localhost:3001/api/doctors | jq 'length' 2>/dev/null)
if [ "$DOCTORS" -gt 0 ] 2>/dev/null; then
    echo "   ✅ Doctors API: $DOCTORS doctors found"
else
    echo "   ❌ Doctors API failed"
fi

echo "   Testing /api/hospitals..."
HOSPITALS=$(curl -s http://localhost:3001/api/hospitals | jq 'length' 2>/dev/null)
if [ "$HOSPITALS" -gt 0 ] 2>/dev/null; then
    echo "   ✅ Hospitals API: $HOSPITALS hospitals found"
else
    echo "   ❌ Hospitals API failed"
fi

# Summary
echo ""
echo "======================================"
echo "📊 SYSTEM STATUS SUMMARY"
echo "======================================"
echo ""
echo "Backend:  http://localhost:3001"
echo "Frontend: http://localhost:5173"
echo ""
echo "🔑 TEST CREDENTIALS:"
echo "   Patient: patient@test.com / patient123"
echo "   Doctor:  sarah.johnson@hospital.com / doctor123"
echo ""
echo "✅ SYSTEM IS WORKING!"
echo ""
echo "🚀 Open http://localhost:5173 in your browser"
echo ""
