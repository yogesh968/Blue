# 🩺 HealthCare+ Management System

A comprehensive healthcare management and appointment booking platform built with Node.js, Express, React, and MySQL.

## 🚀 Features

- **Multi-role System**: Patients, Doctors, and Hospitals
- **Appointment Booking**: Schedule appointments with doctors
- **Hospital Management**: Bed booking and ambulance services
- **Payment Integration**: Secure payment processing
- **Review System**: Rate and review doctors and hospitals
- **Emergency Services**: Quick access to ambulance booking
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- MySQL with Prisma ORM
- JWT Authentication
- bcrypt for password hashing
- Google OAuth 2.0

**Frontend:**
- React (Vite)
- Modern CSS with responsive design
- Fetch API for backend communication

## 👥 Team Structure

This project is developed by a team of 4 members:
- **Person 1**: Authentication & User Management (JWT, Google OAuth, Patient profiles)
- **Person 2**: Doctor & Appointment System
- **Person 3**: Hospital & Emergency Services  
- **Person 4**: Core Setup & Payment System

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- Google OAuth credentials

### Setup Instructions
1. Clone the repository
2. Install dependencies: `npm run install:all`
3. Configure environment variables
4. Set up database and run migrations
5. Start development servers: `npm run dev`

## 📱 Current Features (Person 1 - Authentication)

### Authentication System
- JWT-based authentication
- Google OAuth 2.0 integration
- Role-based access control (Patient, Doctor, Hospital)
- Secure password hashing with bcrypt

### User Management
- User registration and login
- Role selection for new users
- Patient profile management
- Medical records system

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth login
- `POST /api/auth/complete-registration` - Complete OAuth registration
- `POST /api/patients/profile` - Create patient profile
- `GET /api/patients/profile` - Get patient profile
- `POST /api/patients/medical-records` - Add medical record

## 🔐 Security Features

- JWT token-based authentication
- Google OAuth 2.0 integration
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- Session management

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

This is a collaborative project. Each team member works on their assigned module and integrates through pull requests.