const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create Hospitals
  const hospitals = await Promise.all([
    prisma.hospital.create({
      data: {
        name: 'City General Hospital',
        city: 'Mumbai',
        address: '123 Main Street, Andheri West',
        phone: '+91-9876543210'
      }
    }),
    prisma.hospital.create({
      data: {
        name: 'Apollo Medical Center',
        city: 'Delhi',
        address: '456 Health Avenue, CP',
        phone: '+91-9876543211'
      }
    }),
    prisma.hospital.create({
      data: {
        name: 'Max Healthcare',
        city: 'Bangalore',
        address: '789 Care Road, Koramangala',
        phone: '+91-9876543212'
      }
    })
  ]);

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // Clear existing data first
  await prisma.user.deleteMany({});
  await prisma.hospital.deleteMany({});

  const users = await Promise.all([
    // Doctors
    prisma.user.create({
      data: {
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@hospital.com',
        password: hashedPassword,
        phone: '+91-9876543213',
        role: 'DOCTOR'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma@hospital.com',
        password: hashedPassword,
        phone: '+91-9876543214',
        role: 'DOCTOR'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Dr. Amit Patel',
        email: 'amit.patel@hospital.com',
        password: hashedPassword,
        phone: '+91-9876543215',
        role: 'DOCTOR'
      }
    }),
    // Patients
    prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@email.com',
        password: hashedPassword,
        phone: '+91-9876543216',
        role: 'PATIENT'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        password: hashedPassword,
        phone: '+91-9876543217',
        role: 'PATIENT'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Mike Johnson',
        email: 'mike.johnson@email.com',
        password: hashedPassword,
        phone: '+91-9876543218',
        role: 'PATIENT'
      }
    })
  ]);

  // Create Doctors
  const doctors = await Promise.all([
    prisma.doctor.create({
      data: {
        userId: users[0].id,
        hospitalId: hospitals[0].id,
        speciality: 'Cardiology',
        experience: 10,
        fees: 1500,
        qualification: 'MBBS, MD Cardiology'
      }
    }),
    prisma.doctor.create({
      data: {
        userId: users[1].id,
        hospitalId: hospitals[1].id,
        speciality: 'Dermatology',
        experience: 8,
        fees: 1200,
        qualification: 'MBBS, MD Dermatology'
      }
    }),
    prisma.doctor.create({
      data: {
        userId: users[2].id,
        hospitalId: hospitals[2].id,
        speciality: 'Orthopedics',
        experience: 12,
        fees: 1800,
        qualification: 'MBBS, MS Orthopedics'
      }
    })
  ]);

  // Create Patients
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        userId: users[3].id,
        gender: 'Male',
        dob: new Date('1990-05-15'),
        medicalHistory: { allergies: ['Peanuts'], conditions: [] }
      }
    }),
    prisma.patient.create({
      data: {
        userId: users[4].id,
        gender: 'Female',
        dob: new Date('1985-08-22'),
        medicalHistory: { allergies: [], conditions: ['Hypertension'] }
      }
    }),
    prisma.patient.create({
      data: {
        userId: users[5].id,
        gender: 'Male',
        dob: new Date('1992-12-10'),
        medicalHistory: { allergies: ['Dust'], conditions: ['Asthma'] }
      }
    })
  ]);

  // Create Doctor Timings
  await Promise.all([
    prisma.doctorTiming.create({
      data: {
        doctorId: doctors[0].id,
        dayOfWeek: 'MONDAY',
        startTime: '09:00',
        endTime: '17:00'
      }
    }),
    prisma.doctorTiming.create({
      data: {
        doctorId: doctors[0].id,
        dayOfWeek: 'TUESDAY',
        startTime: '09:00',
        endTime: '17:00'
      }
    }),
    prisma.doctorTiming.create({
      data: {
        doctorId: doctors[1].id,
        dayOfWeek: 'WEDNESDAY',
        startTime: '10:00',
        endTime: '18:00'
      }
    }),
    prisma.doctorTiming.create({
      data: {
        doctorId: doctors[2].id,
        dayOfWeek: 'THURSDAY',
        startTime: '08:00',
        endTime: '16:00'
      }
    })
  ]);

  // Create Appointments
  const appointments = await Promise.all([
    prisma.appointment.create({
      data: {
        patientId: patients[0].id,
        doctorId: doctors[0].id,
        appointmentDate: new Date('2024-01-15T10:00:00Z'),
        durationMinutes: 30,
        reason: 'Regular checkup',
        status: 'CONFIRMED'
      }
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[1].id,
        doctorId: doctors[1].id,
        appointmentDate: new Date('2024-01-16T14:00:00Z'),
        durationMinutes: 45,
        reason: 'Skin consultation',
        status: 'PENDING'
      }
    })
  ]);

  // Create Payments
  await Promise.all([
    prisma.payment.create({
      data: {
        appointmentId: appointments[0].id,
        amount: 1500,
        paymentStatus: 'PAID',
        paymentMethod: 'CARD',
        transactionId: 'TXN123456789'
      }
    })
  ]);

  // Create Reviews
  await Promise.all([
    prisma.review.create({
      data: {
        rating: 5,
        reviewText: 'Excellent doctor, very professional and caring.',
        patientId: patients[0].id,
        doctorId: doctors[0].id
      }
    }),
    prisma.review.create({
      data: {
        rating: 4,
        reviewText: 'Good experience, helpful treatment.',
        patientId: patients[1].id,
        doctorId: doctors[1].id
      }
    })
  ]);

  // Create Ambulances
  const ambulances = await Promise.all([
    prisma.ambulance.create({
      data: {
        vehicleNumber: 'MH01AB1234',
        type: 'BASIC',
        hospitalId: hospitals[0].id,
        isAvailable: true,
        location: 'Andheri West'
      }
    }),
    prisma.ambulance.create({
      data: {
        vehicleNumber: 'DL02CD5678',
        type: 'ICU',
        hospitalId: hospitals[1].id,
        isAvailable: true,
        location: 'CP'
      }
    })
  ]);

  // Create Bed Bookings
  await Promise.all([
    prisma.bedBooking.create({
      data: {
        patientId: patients[2].id,
        hospitalId: hospitals[2].id,
        bedType: 'GENERAL',
        admissionDate: new Date('2024-01-10T08:00:00Z'),
        status: 'CONFIRMED',
        totalAmount: 5000,
        charges: { roomCharge: 2000, medicineCharge: 1500, doctorFee: 1500 }
      }
    })
  ]);

  // Create Ambulance Bookings
  await Promise.all([
    prisma.ambulanceBooking.create({
      data: {
        patientId: patients[0].id,
        ambulanceId: ambulances[0].id,
        pickupLocation: 'Home - Bandra West',
        destination: 'City General Hospital',
        bookingTime: new Date('2024-01-12T15:30:00Z'),
        status: 'CONFIRMED',
        amount: 800,
        ambulanceNumber: 'MH01AB1234',
        driverName: 'Ramesh Kumar'
      }
    })
  ]);

  console.log('✅ Database seeding completed successfully!');
  console.log(`Created:
  - ${hospitals.length} hospitals
  - ${users.length} users (3 doctors, 3 patients)
  - ${doctors.length} doctor profiles
  - ${patients.length} patient profiles
  - ${appointments.length} appointments
  - ${ambulances.length} ambulances
  - Various timings, reviews, and bookings`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });