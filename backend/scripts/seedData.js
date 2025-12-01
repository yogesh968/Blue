const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seedData() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create hospitals first
    const hospitals = await Promise.all([
      prisma.hospital.create({
        data: {
          name: "Apollo Hospital",
          city: "Mumbai",
          address: "Sahar Road, Andheri East, Mumbai, Maharashtra 400099",
          phone: "+91-22-6767-1000"
        }
      }),
      prisma.hospital.create({
        data: {
          name: "Max Healthcare",
          city: "Delhi",
          address: "Press Enclave Road, Saket, New Delhi, Delhi 110017",
          phone: "+91-11-2651-5050"
        }
      }),
      prisma.hospital.create({
        data: {
          name: "Fortis Hospital",
          city: "Bangalore",
          address: "154/9, Bannerghatta Road, Opposite IIM-B, Bangalore, Karnataka 560076",
          phone: "+91-80-6621-4444"
        }
      }),
      prisma.hospital.create({
        data: {
          name: "AIIMS",
          city: "Delhi",
          address: "Ansari Nagar, New Delhi, Delhi 110029",
          phone: "+91-11-2658-8500"
        }
      }),
      prisma.hospital.create({
        data: {
          name: "Manipal Hospital",
          city: "Mumbai",
          address: "Dhirubhai Ambani Hospital, Kokilaben Dhirubhai Ambani Hospital & Medical Research Institute",
          phone: "+91-22-4269-6969"
        }
      }),
      prisma.hospital.create({
        data: {
          name: "Kokilaben Hospital",
          city: "Mumbai",
          address: "Rao Saheb Achutrao Patwardhan Marg, Four Bunglows, Andheri West, Mumbai, Maharashtra 400053",
          phone: "+91-22-4269-6969"
        }
      })
    ]);

    console.log(`✅ Created ${hospitals.length} hospitals`);

    // Create doctor users and profiles
    const doctorData = [
      {
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@hospital.com",
        speciality: "Cardiologist",
        experience: 15,
        fees: 800,
        qualification: "MBBS, MD Cardiology",
        hospitalId: hospitals[0].id // Apollo Hospital
      },
      {
        name: "Dr. Michael Chen",
        email: "michael.chen@hospital.com",
        speciality: "Neurologist",
        experience: 12,
        fees: 1200,
        qualification: "MBBS, MD Neurology",
        hospitalId: hospitals[1].id // Max Healthcare
      },
      {
        name: "Dr. Emily Davis",
        email: "emily.davis@hospital.com",
        speciality: "Pediatrician",
        experience: 10,
        fees: 600,
        qualification: "MBBS, MD Pediatrics",
        hospitalId: hospitals[2].id // Fortis Hospital
      },
      {
        name: "Dr. Rajesh Kumar",
        email: "rajesh.kumar@hospital.com",
        speciality: "Orthopedic",
        experience: 18,
        fees: 1000,
        qualification: "MBBS, MS Orthopedics",
        hospitalId: hospitals[3].id // AIIMS
      },
      {
        name: "Dr. Priya Sharma",
        email: "priya.sharma@hospital.com",
        speciality: "Dermatologist",
        experience: 8,
        fees: 700,
        qualification: "MBBS, MD Dermatology",
        hospitalId: hospitals[4].id // Manipal Hospital
      },
      {
        name: "Dr. Amit Patel",
        email: "amit.patel@hospital.com",
        speciality: "Cardiologist",
        experience: 20,
        fees: 1500,
        qualification: "MBBS, MD Cardiology, DM Interventional Cardiology",
        hospitalId: hospitals[5].id // Kokilaben Hospital
      }
    ];

    const hashedPassword = await bcrypt.hash('doctor123', 10);

    for (const doctorInfo of doctorData) {
      // Create user first
      const user = await prisma.user.create({
        data: {
          name: doctorInfo.name,
          email: doctorInfo.email,
          password: hashedPassword,
          phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          role: 'DOCTOR'
        }
      });

      // Create doctor profile
      await prisma.doctor.create({
        data: {
          userId: user.id,
          hospitalId: doctorInfo.hospitalId,
          speciality: doctorInfo.speciality,
          experience: doctorInfo.experience,
          fees: doctorInfo.fees,
          qualification: doctorInfo.qualification
        }
      });

      console.log(`✅ Created doctor: ${doctorInfo.name}`);
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();