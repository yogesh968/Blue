const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seedData() {
  try {
    console.log('🌱 Starting comprehensive database seeding...');

    // Delete existing data to avoid uniques/duplicates
    await prisma.appointment.deleteMany({});
    await prisma.doctor.deleteMany({});
    await prisma.hospital.deleteMany({});
    await prisma.user.deleteMany({ where: { role: 'DOCTOR' } });

    const hospitalData = [
      { name: "Apollo Hospital", city: "Mumbai", address: "Sahar Road, Andheri East", phone: "+91-22-6767-1000" },
      { name: "Max Healthcare", city: "Delhi", address: "Press Enclave Road, Saket", phone: "+91-11-2651-5050" },
      { name: "Fortis Hospital", city: "Bangalore", address: "Bannerghatta Road", phone: "+91-80-6621-4444" },
      { name: "AIIMS Delhi", city: "Delhi", address: "Ansari Nagar", phone: "+91-11-2658-8500" },
      { name: "Manipal Hospital", city: "Mumbai", address: "Dhirubhai Ambani Hospital", phone: "+91-22-4269-6969" },
      { name: "Kokilaben Hospital", city: "Mumbai", address: "Andheri West", phone: "+91-22-4269-6900" },
      { name: "Narayana Health", city: "Bangalore", address: "Bommasandra", phone: "+91-80-7122-2222" },
      { name: "Medanta - The Medicity", city: "Gurgaon", address: "CH Baktawar Singh Road", phone: "+91-124-414-1414" },
      { name: "Lilavati Hospital", city: "Mumbai", address: "Bandra West", phone: "+91-22-2675-1000" },
      { name: "Sir Ganga Ram Hospital", city: "Delhi", address: "Rajinder Nagar", phone: "+91-11-2573-5205" },
      { name: "Aster CMI Hospital", city: "Bangalore", address: "Sahakar Nagar", phone: "+91-80-4342-0100" },
      { name: "Nanavati Hospital", city: "Mumbai", address: "Vile Parle West", phone: "+91-22-2626-7500" },
      { name: "Jaslok Hospital", city: "Mumbai", address: "Pedder Road", phone: "+91-22-6657-3333" },
      { name: "BLK Super Speciality", city: "Delhi", address: "Pusa Road", phone: "+91-11-3040-3040" },
      { name: "Columbia Asia", city: "Bangalore", address: "Hebbal", phone: "+91-80-4179-1000" },
      { name: "Moolchand Hospital", city: "Delhi", address: "Lajpat Nagar", phone: "+91-11-4200-0000" },
      { name: "Breach Candy Hospital", city: "Mumbai", address: "Bhulabhai Desai Road", phone: "+91-22-2367-1888" },
      { name: "Sakra World Hospital", city: "Bangalore", address: "Outer Ring Road", phone: "+91-80-4969-4969" },
      { name: "Holy Family Hospital", city: "Delhi", address: "Okhla Road", phone: "+91-11-2684-5900" },
      { name: "Cloudnine Hospital", city: "Mumbai", address: "Malad West", phone: "+91-22-6177-1777" },
      { name: "Sparsh Hospital", city: "Bangalore", address: "Yeshwanthpur", phone: "+91-80-6122-2000" },
      { name: "St. Stephens Hospital", city: "Delhi", address: "Tis Hazari", phone: "+91-11-2396-6021" },
      { name: "Hiranandani Hospital", city: "Mumbai", address: "Powai", phone: "+91-22-2576-3300" },
      { name: "Rainbow Children's Hospital", city: "Bangalore", address: "Marathahalli", phone: "+91-80-4241-2345" },
      { name: "RG Stone Urology", city: "Delhi", address: "Kailash Colony", phone: "+91-11-4163-1000" }
    ];

    const hospitals = [];
    for (const h of hospitalData) {
      const created = await prisma.hospital.create({ data: h });
      hospitals.push(created);
    }
    console.log(`✅ Created ${hospitals.length} hospitals`);

    const specialties = [
      "Cardiologist", "Neurologist", "Pediatrician", "Orthopedic",
      "Dermatologist", "Gastroenterologist", "Ophthalmologist",
      "ENT Specialist", "Pulmonology", "Gynecologist", "Dentist"
    ];

    const doctorNames = [
      "Sarah Johnson", "Michael Chen", "Emily Davis", "Rajesh Kumar", "Priya Sharma",
      "Amit Patel", "Vikram Singh", "Anjali Rao", "Sanjay Dutt", "Meera Nair",
      "Karan Mehta", "Sneha Gupta", "Arjun Reddy", "Pooja Hegde", "Rohan Joshi",
      "Deepika Roy", "Vivek Oberoi", "Neha Kakkar", "Aditya Seal", "Tara Sutaria",
      "Varun Dhawan", "Kiara Advani", "Ranbir Kapoor", "Alia Bhatt", "Sid Malhotra",
      "Ishaan Khatter", "Janhvi Kapoor", "Sara Ali Khan", "Kartik Aaryan", "Ananya Panday",
      "Vicky Kaushal", "Katrina Kaif", "Ayushmann Khurrana", "Bhumi Pednekar", "Rajkummar Rao"
    ];

    const hashedPassword = await bcrypt.hash('doctor123', 10);

    for (let i = 0; i < doctorNames.length; i++) {
      const hospital = hospitals[i % hospitals.length];
      const specialty = specialties[i % specialties.length];

      const user = await prisma.user.create({
        data: {
          name: `Dr. ${doctorNames[i]}`,
          email: `${doctorNames[i].toLowerCase().replace(' ', '.')}@hospital.com`,
          password: hashedPassword,
          phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          role: 'DOCTOR'
        }
      });

      await prisma.doctor.create({
        data: {
          userId: user.id,
          hospitalId: hospital.id,
          speciality: specialty,
          experience: 5 + Math.floor(Math.random() * 20),
          fees: 400 + Math.floor(Math.random() * 1600),
          qualification: "MBBS, MD"
        }
      });
      console.log(`✅ Created doctor: Dr. ${doctorNames[i]} - ${specialty}`);
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();