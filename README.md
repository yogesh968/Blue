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

**Frontend:**
- React (Vite)
- Modern CSS with responsive design
- Fetch API for backend communication

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AP-Project
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Setup database
mysql -u root -p
CREATE DATABASE healthcare_db;
exit

# Run Prisma migrations
npx prisma migrate dev
npx prisma generate

# Start backend server
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🗄️ Database Configuration

Update your `.env` file in the backend directory:

```env
DATABASE_URL="mysql://username:password@localhost:3306/healthcare_db"
JWT_SECRET="your_super_secret_jwt_key"
PORT=5000
NODE_ENV=development
```

## 🚀 Running the Application

1. **Start Backend**: `cd backend && npm run dev` (Port 5000)
2. **Start Frontend**: `cd frontend && npm run dev` (Port 5173)
3. **Access Application**: Open http://localhost:5173

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `PUT /api/doctors/:id` - Update doctor profile

### Hospitals
- `GET /api/hospitals` - Get all hospitals
- `GET /api/hospitals/:id` - Get hospital by ID
- `PUT /api/hospitals/:id` - Update hospital info

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get user appointments
- `PUT /api/appointments/:id/status` - Update appointment status

### Payments
- `POST /api/payments` - Process payment

### Reviews
- `POST /api/reviews` - Create review

## 🏗️ Project Structure

```
AP-Project/
├── backend/
│   ├── controllers/     # Business logic
│   ├── routes/         # API routes
│   ├── middleware/     # Authentication & validation
│   ├── prisma/         # Database schema & migrations
│   ├── db/            # Database configuration
│   └── server.js      # Express server setup
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/     # Page components
│   │   ├── services/  # API service functions
│   │   └── utils/     # Utility functions
│   └── public/        # Static assets
└── README.md
```

## 🎨 UI/UX Features

- **Clean Healthcare Theme**: White background with soft blue/green accents
- **Responsive Design**: Mobile-first approach
- **Intuitive Navigation**: Easy-to-use interface
- **Quick Actions**: Emergency services, appointment booking
- **Search Functionality**: Find doctors and hospitals easily

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization

## 🚑 Emergency Features

- Quick ambulance booking
- Hospital bed availability
- Emergency contact system
- Location-based services

## 📈 Future Enhancements

- Real-time notifications
- Video consultation
- Medical records management
- Insurance integration
- Multi-language support
- Mobile app development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and queries, please contact the development team.
