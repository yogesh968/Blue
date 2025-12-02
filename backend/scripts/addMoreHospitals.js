const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addMoreHospitals() {
  console.log('🏥 Adding more hospitals...');

  const newHospitals = [
    {
      name: 'AIIMS Delhi',
      city: 'Delhi',
      address: 'Ansari Nagar, New Delhi',
      phone: '+91-11-26588500'
    },
    {
      name: 'Kokilaben Hospital',
      city: 'Mumbai',
      address: 'Andheri West, Mumbai',
      phone: '+91-22-42696969'
    },
    {
      name: 'Narayana Health',
      city: 'Bangalore',
      address: 'Bommasandra, Bangalore',
      phone: '+91-80-71222222'
    },
    {
      name: 'Max Super Speciality',
      city: 'Delhi',
      address: 'Saket, New Delhi',
      phone: '+91-11-26515050'
    },
    {
      name: 'Lilavati Hospital',
      city: 'Mumbai',
      address: 'Bandra West, Mumbai',
      phone: '+91-22-26567777'
    },
    {
      name: 'Columbia Asia',
      city: 'Bangalore',
      address: 'Whitefield, Bangalore',
      phone: '+91-80-39989999'
    },
    {
      name: 'Medanta Hospital',
      city: 'Gurgaon',
      address: 'Sector 38, Gurgaon',
      phone: '+91-124-4141414'
    },
    {
      name: 'Hinduja Hospital',
      city: 'Mumbai',
      address: 'Mahim, Mumbai',
      phone: '+91-22-24447777'
    }
  ];

  for (const hospital of newHospitals) {
    await prisma.hospital.create({
      data: hospital
    });
  }

  console.log('✅ Added 8 more hospitals');
  console.log('🎉 Total hospitals now available for bed booking');
}

addMoreHospitals()
  .catch(console.error)
  .finally(() => prisma.$disconnect());