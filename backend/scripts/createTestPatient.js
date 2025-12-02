const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createTestPatient() {
  try {
    const hashedPassword = await bcrypt.hash('patient123', 10);
    
    const user = await prisma.user.create({
      data: {
        name: 'Test Patient',
        email: 'patient@test.com',
        password: hashedPassword,
        phone: '+91-9876543210',
        role: 'PATIENT'
      }
    });

    const patient = await prisma.patient.create({
      data: {
        userId: user.id,
        gender: 'Male',
        dob: new Date('1990-01-01')
      }
    });

    console.log('✅ Test patient created:', { userId: user.id, patientId: patient.id });
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestPatient();
