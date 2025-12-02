const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function resetAndSeed() {
  try {
    console.log('🗑️  Clearing existing data...\n');
    
    await prisma.ambulanceBooking.deleteMany();
    await prisma.ambulance.deleteMany();
    await prisma.bedBooking.deleteMany();
    await prisma.doctorLocation.deleteMany();
    await prisma.doctorSchedule.deleteMany();
    await prisma.doctorInvitation.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.review.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.doctorTiming.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.user.deleteMany();
    await prisma.hospital.deleteMany();
    
    console.log('✅ Cleared all data\n');
    console.log('🌱 Starting seeding...\n');

    // Hospitals
    const hospitals = await Promise.all([
      prisma.hospital.create({ data: { name: "Apollo Hospital", city: "Mumbai", address: "Sahar Road, Andheri East", phone: "+91-22-6767-1000" }}),
      prisma.hospital.create({ data: { name: "Max Healthcare", city: "Delhi", address: "Press Enclave Road, Saket", phone: "+91-11-2651-5050" }}),
      prisma.hospital.create({ data: { name: "Fortis Hospital", city: "Bangalore", address: "Bannerghatta Road", phone: "+91-80-6621-4444" }}),
    ]);
    console.log(`✅ ${hospitals.length} hospitals`);

    const hashedPassword = await bcrypt.hash('doctor123', 10);

    // Doctors
    const doctorsData = [
      { name: "Dr. Sarah Johnson", email: "sarah.johnson@hospital.com", speciality: "Cardiologist", experience: 15, fees: 800, qualification: "MBBS, MD", hospitalId: hospitals[0].id },
      { name: "Dr. Michael Chen", email: "michael.chen@hospital.com", speciality: "Neurologist", experience: 12, fees: 1200, qualification: "MBBS, MD", hospitalId: hospitals[1].id },
      { name: "Dr. Emily Davis", email: "emily.davis@hospital.com", speciality: "Pediatrician", experience: 10, fees: 600, qualification: "MBBS, MD", hospitalId: hospitals[2].id },
    ];

    const doctors = [];
    for (const doc of doctorsData) {
      const user = await prisma.user.create({
        data: { name: doc.name, email: doc.email, password: hashedPassword, phone: `+91-98765432${10 + doctors.length}`, role: 'DOCTOR' }
      });
      const doctor = await prisma.doctor.create({
        data: { userId: user.id, hospitalId: doc.hospitalId, speciality: doc.speciality, experience: doc.experience, fees: doc.fees, qualification: doc.qualification }
      });
      doctors.push(doctor);
    }
    console.log(`✅ ${doctors.length} doctors`);

    // Patient
    const patientUser = await prisma.user.create({
      data: { name: 'Test Patient', email: 'patient@test.com', password: await bcrypt.hash('patient123', 10), phone: '+91-9876543210', role: 'PATIENT' }
    });
    const patient = await prisma.patient.create({
      data: { userId: patientUser.id, gender: 'Male', dob: new Date('1990-01-01') }
    });
    console.log(`✅ 1 patient`);

    // Hospital Admin User
    const hospitalUser = await prisma.user.create({
      data: { name: 'Apollo Admin', email: 'admin@apollo.com', password: await bcrypt.hash('hospital123', 10), phone: '+91-22-6767-1000', role: 'HOSPITAL' }
    });
    console.log(`✅ 1 hospital admin`);

    // Appointments
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    await prisma.appointment.create({
      data: { patientId: patient.id, doctorId: doctors[0].id, appointmentDate: tomorrow, reason: 'Regular checkup', status: 'PENDING' }
    });
    console.log(`✅ 1 appointment`);

    // Doctor locations
    for (let i = 0; i < doctors.length; i++) {
      await prisma.doctorLocation.create({
        data: { doctorId: doctors[i].id, name: `${hospitals[i].name} Clinic`, address: hospitals[i].address, city: hospitals[i].city, phone: hospitals[i].phone }
      });
    }
    console.log(`✅ ${doctors.length} locations`);

    // Bed booking
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
    console.log(`✅ 1 bed booking`);

    // Ambulances
    for (let i = 0; i < 3; i++) {
      await prisma.ambulance.create({
        data: { vehicleNumber: `AMB-00${i + 1}`, type: ['ICU', 'ADVANCED', 'BASIC'][i], hospitalId: hospitals[i].id, isAvailable: true, location: hospitals[i].city }
      });
    }
    console.log(`✅ 3 ambulances`);

    // Ambulance booking
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
    console.log(`✅ 1 ambulance booking`);

    console.log('\n🎉 Complete!\n');
    console.log('📊 Summary:');
    console.log('  - 3 Hospitals');
    console.log('  - 3 Doctors');
    console.log('  - 1 Patient');
    console.log('  - 1 Appointment');
    console.log('  - 3 Locations');
    console.log('  - 1 Bed Booking');
    console.log('  - 3 Ambulances');
    console.log('  - 1 Ambulance Booking\n');
    console.log('🔑 Credentials:');
    console.log('  Doctor: sarah.johnson@hospital.com / doctor123');
    console.log('  Patient: patient@test.com / patient123');
    console.log('  Hospital: admin@apollo.com / hospital123');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetAndSeed();
