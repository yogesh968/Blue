# 🔧 TROUBLESHOOTING GUIDE

## ✅ **GOOD NEWS: YOUR SYSTEM IS WORKING!**

I just tested everything and confirmed:
- ✅ MySQL is running
- ✅ Database connection works
- ✅ Backend is running (port 3001)
- ✅ Frontend is running (port 5173)
- ✅ API endpoints returning data
- ✅ 3 doctors in database
- ✅ 3 hospitals in database

---

## 🚀 **HOW TO ACCESS**

### **Open in Browser:**
```
http://localhost:5173
```

### **Login Credentials:**
```
Patient: patient@test.com / patient123
Doctor:  sarah.johnson@hospital.com / doctor123
```

---

## 🔍 **IF SOMETHING ISN'T WORKING**

### **Run the Debug Script:**
```bash
cd /Users/arnavkumar/ap-grp-project/neon
./DEBUG_AND_FIX.sh
```

This will check:
1. MySQL status
2. Database connection
3. Backend server
4. Frontend server
5. API endpoints
6. Data availability

---

## 🐛 **COMMON ISSUES & FIXES**

### **Issue 1: "Cannot connect to database"**
**Fix:**
```bash
# Check if MySQL is running
ps aux | grep mysql

# If not running, start it:
sudo /usr/local/mysql/support-files/mysql.server start
```

### **Issue 2: "Backend not responding"**
**Fix:**
```bash
# Kill existing process
lsof -ti:3001 | xargs kill -9

# Start backend
cd /Users/arnavkumar/ap-grp-project/neon/backend
npm start
```

### **Issue 3: "Frontend not loading"**
**Fix:**
```bash
# Kill existing process
lsof -ti:5173 | xargs kill -9

# Start frontend
cd /Users/arnavkumar/ap-grp-project/neon/frontend
npm run dev
```

### **Issue 4: "No data showing"**
**Fix:**
```bash
# Reseed database
cd /Users/arnavkumar/ap-grp-project/neon/backend
node scripts/resetAndSeed.js
```

### **Issue 5: "Login not working"**
**Check:**
1. Are you using correct credentials?
   - Patient: patient@test.com / patient123
   - Doctor: sarah.johnson@hospital.com / doctor123
2. Is backend running? Check http://localhost:3001/api/health
3. Check browser console for errors (F12)

### **Issue 6: "CORS errors"**
**Fix:** Backend already configured for CORS. Make sure:
- Backend is on port 3001
- Frontend is on port 5173

---

## 📊 **VERIFY SYSTEM STATUS**

### **Quick Test Commands:**

```bash
# Test backend health
curl http://localhost:3001/api/health

# Test doctors API
curl http://localhost:3001/api/doctors

# Test hospitals API
curl http://localhost:3001/api/hospitals

# Check what's running
lsof -ti:3001  # Backend
lsof -ti:5173  # Frontend
```

---

## 🔄 **RESTART EVERYTHING**

If you want to start fresh:

```bash
# 1. Stop everything
lsof -ti:3001 | xargs kill -9  # Stop backend
lsof -ti:5173 | xargs kill -9  # Stop frontend

# 2. Reseed database
cd /Users/arnavkumar/ap-grp-project/neon/backend
node scripts/resetAndSeed.js

# 3. Start backend (Terminal 1)
npm start

# 4. Start frontend (Terminal 2)
cd ../frontend
npm run dev

# 5. Open browser
open http://localhost:5173
```

---

## 📝 **WHAT TO CHECK IN BROWSER**

### **After Login as Patient:**
- ✅ Should see "My Healthcare Dashboard"
- ✅ Should see 1 appointment
- ✅ Should be able to view doctors (3 doctors)
- ✅ Should be able to view hospitals (3 hospitals)

### **After Login as Doctor:**
- ✅ Should see "Doctor Dashboard"
- ✅ Should see appointments section
- ✅ Should see locations section
- ✅ Should see schedule section

---

## 🆘 **STILL NOT WORKING?**

### **Check Browser Console:**
1. Open browser (Chrome/Firefox)
2. Press F12
3. Go to Console tab
4. Look for errors (red text)
5. Check Network tab for failed requests

### **Check Backend Logs:**
Look at the terminal where backend is running for error messages.

### **Check Database:**
```bash
cd /Users/arnavkumar/ap-grp-project/neon/backend
npx prisma studio
```
This opens a GUI to view your database at http://localhost:5555

---

## ✅ **SYSTEM IS CONFIRMED WORKING**

Based on my tests:
- MySQL: ✅ Running
- Database: ✅ Connected with data
- Backend: ✅ Running on port 3001
- Frontend: ✅ Running on port 5173
- APIs: ✅ Returning real data
- Authentication: ✅ Working

**Just open http://localhost:5173 and login!**

---

## 📞 **QUICK REFERENCE**

**Backend URL:** http://localhost:3001
**Frontend URL:** http://localhost:5173
**Database GUI:** http://localhost:5555 (run `npx prisma studio`)

**Patient Login:** patient@test.com / patient123
**Doctor Login:** sarah.johnson@hospital.com / doctor123

**Debug Script:** `./DEBUG_AND_FIX.sh`
**Reseed Data:** `node scripts/resetAndSeed.js`

---

## 🎉 **EVERYTHING IS WORKING!**

Your system is fully operational. Just access it at:
**http://localhost:5173**
