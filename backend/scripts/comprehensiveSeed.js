const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function comprehensiveSeed() {
  try {
    console.log('🌱 Starting comprehensive database seeding...\n');

    // Create hospitals
    const hospitals = await Promise.all([
      prisma.hospital.create({ data: { name: "Apollo Hospital", city: "Mumbai", address: "Sahar Road, Andheri East, Mumbai, Maharashtra 400099", phone: "+91-22-6767-1000" }}),
      prisma.hospital.create({ data: { name: "Max Healthcare", city: "Delhi", address: "Press Enclave Road, Saket, New Delhi, Delhi 110017", phone: "+91-11-2651-5050" }}),
      prisma.hospital.create({ data: { name: "Fortis Hospital", city: "Bangalore", address: "154/9, Bannerghatta Road, Bangalore, Karnataka 560076", phone: "+91-80-6621-4444" }}),
    ]);
    console.log(`✅ Created ${hospitals.length} hospitals`);

    const hashedPassword = await bcrypt.hash('doctor123', 10);

    // Create doctors with users
    const doctorsData = [
      { name: "Dr. Sarah Johnson", email: "sarah.johnson@hospital.com", speciality: "Cardiologist", experience: 15, fees: 800, qualification: "MBBS, MD Cardiology", hospitalId: hospitals[0].id },
      { name: "Dr. Michael Chen", email: "michael.chen@hospital.com", speciality: "Neurologist", experience: 12, fees: 1200, qualification: "MBBS, MD Neurology", hospitalId: hospitals[1].id },
      { name: "Dr. Emily Davis", email: "emily.davis@hospital.com", speciality: "Pediatrician", experience: 10, fees: 600, qualification: "MBBS, MD Pediatrics", hospitalId: hospitals[2].id },
    ];

    const doctors = [];
    for (const doc of doctorsData) {
      const user = await prisma.user.create({
        data: { name: doc.name, email: doc.email, password: hashedPassword, phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`, role: 'DOCTOR' }
      });
      const doctor = await prisma.doctor.create({
        data: { userId: user.id, hospitalId: doc.hospitalId, speciality: doc.speciality, experience: doc.experience, fees: doc.fees, qualification: doc.qualification }
      });
      doctors.push(doctor);
      console.log(`✅ Created doctor: ${doc.name}`);
    }

    // Create patients
    const patientPassword = await bcrypt.hash('patient123', 10);
    const patientUser = await prisma.user.create({
      data: { name: 'Test Patient', email: 'patient@test.com', password: patientPassword, phone: '+91-9876543210', role: 'PATIENT' }
    });
    const patient = await prisma.patient.create({
      data: { userId: patientUser.id, gender: 'Male', dob: new Date('1990-01-01') }
    });
    console.log(`✅ Created patient: Test Patient`);

    // Create appointments
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctors[0].id,
        appointmentDate: tomorrow,
        reason: 'Regular checkup',
        status: 'PENDING'
      }
    });
    console.log(`✅ Created appointment`);

    // Create doctor locations
    for (const doctor of doctors) {
      await prisma.doctorLocation.create({
        data: {
          doctorId: doctor.id,
          name: `${doctor.id === doctors[0].id ? 'Apollo' : doctor.id === doctors[1].id ? 'Max' : 'Fortis'} Clinic`,
          address: hospitals[doctor.hospitalId - 1].address,
          city: hospitals[doctor.hospitalId - 1].city,
          phone: hospitals[doctor.hospitalId - 1].phone
        }
      });
    }
    console.log(`✅ Created doctor locations`);

    // Create bed bookings
    await prisma.bedBooking.create({
      data: {
        patientId: patient.id,
        hospitalId: hospitals[0].id,
        bedType: 'GENERAL',
        admissionDate: new Date(),
        status: 'CONFIRMED',
        totalAmount: 5000,
        charges: { bedCharge: 2000, foodCharge: 1000, medicineCharge: 1500, doctorFee: 500 }
      }
    });
    console.log(`✅ Created bed booking`);

    // Create ambulances
    for (let i = 0; i < hospitals.length; i++) {
      await prisma.ambulance.create({
        data: {
          vehicleNumber: `AMB-00${i + 1}`,
          type: i === 0 ? 'ICU' : i === 1 ? 'ADVANCED' : 'BASIC',
          hospitalId: hospitals[i].id,
          isAvailable: true,
          location: hospitals[i].city
        }
      });
    }
    console.log(`✅ Created ambulances`);

    // Create ambulance booking
    const ambulance = await prisma.ambulance.findFirst();
    await prisma.ambulanceBooking.create({
      data: {
        patientId: patient.id,
        ambulanceId: ambulance.id,
        pickupLocation: 'Downtown Area',
        destination: hospitals[0].name,
        bookingTime: new Date(),
        status: 'CONFIRMED',
        amount: 2000,
        ambulanceNumber: ambulance.vehicleNumber,
        driverName: 'Raj Kumar'
      }
    });
    console.log(`✅ Created ambulance booking`);

    console.log('\n🎉 Comprehensive seeding completed!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

comprehensiveSeed();
