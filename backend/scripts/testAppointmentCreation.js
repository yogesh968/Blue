const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAppointmentCreation() {
  try {
    console.log('🧪 Testing Appointment Creation...\n');

    // Get first patient and doctor
    const patient = await prisma.patient.findFirst();
    const doctor = await prisma.doctor.findFirst();

    if (!patient || !doctor) {
      console.log('❌ No patient or doctor found in database');
      return;
    }

    console.log(`Patient ID: ${patient.id}`);
    console.log(`Doctor ID: ${doctor.id}\n`);

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        reason: 'Regular checkup',
        status: 'PENDING'
      },
      include: {
        patient: {
          include: { user: true }
        },
        doctor: {
          include: { 
            user: true,
            hospital: true
          }
        }
      }
    });

    console.log('✅ Appointment created successfully!');
    console.log(`   ID: ${appointment.id}`);
    console.log(`   Patient: ${appointment.patient.user.name}`);
    console.log(`   Doctor: ${appointment.doctor.user.name}`);
    console.log(`   Hospital: ${appointment.doctor.hospital.name}`);
    console.log(`   Date: ${appointment.appointmentDate.toISOString()}`);
    console.log(`   Status: ${appointment.status}\n`);

    // Verify we can fetch it
    const fetchedAppointment = await prisma.appointment.findUnique({
      where: { id: appointment.id }
    });

    if (fetchedAppointment) {
      console.log('✅ Appointment can be fetched from database');
    }

    console.log('\n🎉 All appointment tests passed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testAppointmentCreation();
