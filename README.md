# 🩺 HealthCare+ Management System

A comprehensive healthcare management and appointment booking platform built with Node.js, Express, React, and MySQL.

## 🚀 Features

- **Multi-role System**: Patients, Doctors, and Hospitals
- **Appointment Booking**: Schedule appointments with doctors
- **Hospital Management**: Bed booking and ambulance services
- **Payment Integration**: Secure payment processing
- **Review System**: Rate and review doctors and hospitals
- **Emergency Services**: Quick access to ambulance booking
- **Google OAuth**: Secure authentication with Google
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- MySQL with Prisma ORM
- JWT Authentication
- Google OAuth 2.0
- bcrypt for password hashing

**Frontend:**
- React (Vite)
- Modern CSS with responsive design
- Fetch API for backend communication

## 🌐 Live Demo

- **Frontend**: [Deployed on Render](https://your-frontend-url.onrender.com)
- **Backend API**: [Deployed on Render](https://your-backend-url.onrender.com)

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🔧 Local Development Setup

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
npx prisma generate
npx prisma db push
npm run db:seed

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

## 🚀 Deployment on Render

### Backend Deployment
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables:
   ```
   DATABASE_URL=your_mysql_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NODE_ENV=production
   ```

### Frontend Deployment
1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Set build command: `cd frontend && npm install && npm run build`
4. Set publish directory: `frontend/dist`

## 🗄️ Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL="mysql://username:password@host:port/database_name"
JWT_SECRET="your_super_secret_jwt_key"
GOOGLE_CLIENT_ID="your_google_oauth_client_id"
GOOGLE_CLIENT_SECRET="your_google_oauth_client_secret"
PORT=5000
NODE_ENV=production
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `PUT /api/doctors/:id` - Update doctor profile
- `GET /api/doctor-locations` - Get doctor locations

### Hospitals
- `GET /api/hospitals` - Get all hospitals
- `GET /api/hospitals/:id` - Get hospital by ID
- `PUT /api/hospitals/:id` - Update hospital info
- `POST /api/bed-bookings` - Book hospital bed
- `POST /api/ambulances` - Book ambulance

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get user appointments
- `PUT /api/appointments/:id/status` - Update appointment status

### Payments & Reviews
- `POST /api/payments` - Process payment
- `POST /api/reviews` - Create review
- `GET /api/reviews` - Get reviews

## 🏗️ Project Structure

```
AP-Project/
├── backend/
│   ├── controllers/     # Business logic
│   ├── routes/         # API routes
│   ├── middleware/     # Authentication & validation
│   ├── config/         # Passport configuration
│   ├── prisma/         # Database schema & migrations
│   ├── db/            # Database configuration
│   ├── scripts/       # Utility scripts
│   └── server.js      # Express server setup
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/     # Page components
│   │   ├── services/  # API service functions
│   │   ├── utils/     # Utility functions
│   │   └── theme/     # Theme configuration
│   └── public/        # Static assets
└── README.md
```

## 🎨 UI/UX Features

- **Clean Healthcare Theme**: White background with soft blue/green accents
- **Responsive Design**: Mobile-first approach
- **Intuitive Navigation**: Easy-to-use interface
- **Quick Actions**: Emergency services, appointment booking
- **Search Functionality**: Find doctors and hospitals easily
- **Role-based Dashboards**: Separate portals for patients, doctors, and hospitals

## 🔐 Security Features

- JWT-based authentication
- Google OAuth 2.0 integration
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS protection

## 🚑 Emergency Features

- Quick ambulance booking
- Hospital bed availability
- Emergency contact system
- Location-based services
- Body diagram for symptom selection

## 📈 Future Enhancements

- Real-time notifications
- Video consultation
- Medical records management
- Insurance integration
- Multi-language support
- Mobile app development
- Telemedicine features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and queries, please contact the development team or create an issue in the repository.

## 🙏 Acknowledgments

- Built as part of an academic project
- Thanks to all team members who contributed to different modules
- Special thanks to the healthcare professionals who provided domain expertise