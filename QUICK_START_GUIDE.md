# Healthcare Portal - Quick Start Guide

## 🚀 **Start the Application**

### **Backend:**
```bash
cd /Users/arnavkumar/ap-grp-project/neon/backend
npm start
```
Server runs on: `http://localhost:3001`

### **Frontend:**
```bash
cd /Users/arnavkumar/ap-grp-project/neon/frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 🧪 **Test the System**

### **1. Test API Endpoints:**
```bash
cd /Users/arnavkumar/ap-grp-project/neon/backend
node scripts/testEndpoints.js
```

### **2. Test Appointment Creation:**
```bash
node scripts/testAppointmentCreation.js
```

### **3. Manual API Tests:**
```bash
# Get all doctors
curl http://localhost:3001/api/doctors

# Get all hospitals
curl http://localhost:3001/api/hospitals

# Health check
curl http://localhost:3001/api/health
```

---

## 🔑 **Login Credentials**

### **Doctor Account:**
```
Email: sarah.johnson@hospital.com
Password: doctor123
```

### **Patient Account:**
```
Email: patient@test.com
Password: patient123
```

---

## 📊 **Database Info**

### **Connection:**
```
Host: localhost
Port: 3306
Database: ap_hospital
User: root
Password: Pass_word7
```

### **Current Data:**
- 6 Hospitals
- 6 Doctors
- 1 Patient
- 1 Appointment

---

## 🔧 **Useful Commands**

### **Reset Database:**
```bash
cd /Users/arnavkumar/ap-grp-project/neon/backend
npx prisma db push --accept-data-loss
npx prisma generate
node scripts/seedData.js
node scripts/createTestPatient.js
```

### **View Database Schema:**
```bash
npx prisma studio
```
Opens at: `http://localhost:5555`

### **Generate Prisma Client:**
```bash
npx prisma generate
```

---

## 📝 **API Endpoints Reference**

### **Public Endpoints:**
- `GET /api/health` - Health check
- `GET /api/doctors` - List doctors
- `GET /api/hospitals` - List hospitals
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### **Protected Endpoints (Require JWT Token):**
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- `GET /api/doctors/:id/schedule` - Get doctor schedule
- `PUT /api/doctors/:id/schedule` - Update schedule
- `GET /api/bed-bookings` - Get bed bookings
- `GET /api/ambulances/bookings` - Get ambulance bookings

---

## 🐛 **Troubleshooting**

### **Port Already in Use:**
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### **Database Connection Error:**
```bash
# Check MySQL is running
brew services list | grep mysql

# Start MySQL
brew services start mysql
```

### **Prisma Client Not Found:**
```bash
npx prisma generate
```

### **Schema Out of Sync:**
```bash
npx prisma db push
npx prisma generate
```

---

## 📚 **File Structure**

```
neon/
├── backend/
│   ├── controllers/       # Business logic
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   ├── prisma/          # Database schema
│   ├── scripts/         # Utility scripts
│   ├── generated/       # Prisma client
│   └── server.js        # Main server file
│
└── frontend/
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   └── App.jsx      # Main app
    └── package.json
```

---

## ✅ **What's Working**

- ✅ Database fully synchronized
- ✅ All API endpoints functional
- ✅ Authentication system working
- ✅ Test data loaded
- ✅ Appointment creation working
- ✅ Doctor/Hospital listings working

---

## ⚠️ **What Needs Work**

- ⚠️ Frontend using mock data (needs API integration)
- ⚠️ Payment processing not implemented
- ⚠️ Real-time notifications not implemented
- ⚠️ Email notifications not configured

---

## 🎯 **Next Steps**

1. **Start both servers** (backend + frontend)
2. **Test login** with provided credentials
3. **Integrate frontend** with backend APIs
4. **Test appointment booking** flow
5. **Deploy to production**

---

## 📞 **Support**

If you encounter issues:
1. Check the error logs in terminal
2. Verify database is running
3. Ensure all dependencies are installed
4. Check port availability
5. Review the FIXES_APPLIED.md document

---

## 🎉 **You're Ready!**

The backend is fully functional and ready to use. Start the servers and begin testing!
