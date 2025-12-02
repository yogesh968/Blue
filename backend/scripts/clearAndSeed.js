const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log('🧹 Clearing existing data...');
  
  // Delete in correct order to avoid foreign key constraints
  await prisma.payment.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.doctorTiming.deleteMany();
  await prisma.doctorLocation.deleteMany();
  await prisma.doctorSchedule.deleteMany();
  await prisma.doctorInvitation.deleteMany();
  await prisma.ambulanceBooking.deleteMany();
  await prisma.bedBooking.deleteMany();
  await prisma.ambulance.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();
  await prisma.hospital.deleteMany();
  
  console.log('✅ Database cleared');
}

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  // Create hospitals
  const hospitals = await Promise.all([
    prisma.hospital.create({
      data: {
        name: 'Apollo Hospital',
        city: 'Mumbai',
        address: 'Bandra West, Mumbai',
        phone: '+91-9876543210'
      }
    }),
    prisma.hospital.create({
      data: {
        name: 'Fortis Hospital',
        city: 'Delhi',
        address: 'Vasant Kunj, Delhi',
        phone: '+91-9876543211'
      }
    }),
    prisma.hospital.create({
      data: {
        name: 'Manipal Hospital',
        city: 'Bangalore',
        address: 'HAL Airport Road, Bangalore',
        phone: '+91-9876543212'
      }
    })
  ]);

  console.log('✅ Hospitals created');

  // Create doctor users and profiles
  const doctorData = [
    {
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@hospital.com',
      speciality: 'Cardiology',
      experience: 15,
      fees: 800,
      qualification: 'MBBS, MD Cardiology',
      hospitalId: hospitals[0].id
    },
    {
      name: 'Dr. Priya Sharma',
      email: 'priya.sharma@hospital.com',
      speciality: 'Neurology',
      experience: 12,
      fees: 900,
      qualification: 'MBBS, DM Neurology',
      hospitalId: hospitals[0].id
    },
    {
      name: 'Dr. Amit Patel',
      email: 'amit.patel@hospital.com',
      speciality: 'Orthopedics',
      experience: 10,
      fees: 700,
      qualification: 'MBBS, MS Orthopedics',
      hospitalId: hospitals[1].id
    },
    {
      name: 'Dr. Sunita Reddy',
      email: 'sunita.reddy@hospital.com',
      speciality: 'Pediatrician',
      experience: 8,
      fees: 600,
      qualification: 'MBBS, MD Pediatrics',
      hospitalId: hospitals[1].id
    },
    {
      name: 'Dr. Vikram Singh',
      email: 'vikram.singh@hospital.com',
      speciality: 'Dermatology',
      experience: 6,
      fees: 500,
      qualification: 'MBBS, MD Dermatology',
      hospitalId: hospitals[2].id
    },
    {
      name: 'Dr. Kavya Nair',
      email: 'kavya.nair@hospital.com',
      speciality: 'Gastroenterology',
      experience: 14,
      fees: 850,
      qualification: 'MBBS, DM Gastroenterology',
      hospitalId: hospitals[2].id
    },
    {
      name: 'Dr. Arjun Mehta',
      email: 'arjun.mehta@hospital.com',
      speciality: 'Ophthalmology',
      experience: 9,
      fees: 650,
      qualification: 'MBBS, MS Ophthalmology',
      hospitalId: hospitals[0].id
    },
    {
      name: 'Dr. Deepika Joshi',
      email: 'deepika.joshi@hospital.com',
      speciality: 'ENT',
      experience: 7,
      fees: 550,
      qualification: 'MBBS, MS ENT',
      hospitalId: hospitals[1].id
    }
  ];

  const hashedPassword = await bcrypt.hash('doctor123', 10);

  for (const doctor of doctorData) {
    // Create user
    const user = await prisma.user.create({
      data: {
        name: doctor.name,
        email: doctor.email,
        password: hashedPassword,
        phone: '+91-9876543210',
        role: 'DOCTOR'
      }
    });

    // Create doctor profile
    await prisma.doctor.create({
      data: {
        userId: user.id,
        hospitalId: doctor.hospitalId,
        speciality: doctor.speciality,
        experience: doctor.experience,
        fees: doctor.fees,
        qualification: doctor.qualification
      }
    });
  }

  console.log('✅ Doctors created');

  // Create a sample patient
  const patientUser = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@email.com',
      password: await bcrypt.hash('patient123', 10),
      phone: '+91-9876543220',
      role: 'PATIENT'
    }
  });

  await prisma.patient.create({
    data: {
      userId: patientUser.id,
      gender: 'Male',
      dob: new Date('1990-01-01')
    }
  });

  console.log('✅ Sample patient created');
  console.log('🎉 Database seeding completed successfully!');
}

async function main() {
  try {
    await clearDatabase();
    await seedDatabase();
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();