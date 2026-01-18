const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    await prisma.doctorInvitation.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.appointment.deleteMany({});
    await prisma.doctorTiming.deleteMany({});
    await prisma.doctorLocation.deleteMany({});
    await prisma.doctorSchedule.deleteMany({});
    await prisma.bedBooking.deleteMany({});
    await prisma.ambulanceBooking.deleteMany({});
    await prisma.ambulance.deleteMany({});
    await prisma.doctor.deleteMany({});
    await prisma.patient.deleteMany({});
    await prisma.hospital.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('✅ Cleared existing data');

    // Create hospitals
    const hospitals = await Promise.all([
      prisma.hospital.create({
        data: {
          name: 'Apollo Hospital',
          city: 'Mumbai',
          address: 'Bandra West, Mumbai, Maharashtra 400050',
          phone: '+91-22-26567777'
        }
      }),
      prisma.hospital.create({
        data: {
          name: 'Fortis Hospital',
          city: 'Delhi',
          address: 'Vasant Kunj, New Delhi, Delhi 110070',
          phone: '+91-11-26515050'
        }
      }),
      prisma.hospital.create({
        data: {
          name: 'Manipal Hospital',
          city: 'Bangalore',
          address: 'HAL Airport Road, Bangalore, Karnataka 560017',
          phone: '+91-80-39989999'
        }
      }),
      prisma.hospital.create({
        data: {
          name: 'AIIMS Delhi',
          city: 'Delhi',
          address: 'Ansari Nagar, New Delhi, Delhi 110029',
          phone: '+91-11-26588500'
        }
      }),
      prisma.hospital.create({
        data: {
          name: 'Kokilaben Hospital',
          city: 'Mumbai',
          address: 'Andheri West, Mumbai, Maharashtra 400053',
          phone: '+91-22-42696969'
        }
      }),
      prisma.hospital.create({
        data: {
          name: 'Narayana Health',
          city: 'Bangalore',
          address: 'Bommasandra, Bangalore, Karnataka 560099',
          phone: '+91-80-71222222'
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
        qualification: 'MBBS, MD Cardiology, DM Interventional Cardiology',
        hospitalId: hospitals[0].id
      },
      {
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma@hospital.com',
        speciality: 'Neurology',
        experience: 12,
        fees: 900,
        qualification: 'MBBS, MD Medicine, DM Neurology',
        hospitalId: hospitals[0].id
      },
      {
        name: 'Dr. Amit Patel',
        email: 'amit.patel@hospital.com',
        speciality: 'Orthopedics',
        experience: 10,
        fees: 700,
        qualification: 'MBBS, MS Orthopedics, Fellowship in Joint Replacement',
        hospitalId: hospitals[1].id
      },
      {
        name: 'Dr. Sunita Reddy',
        email: 'sunita.reddy@hospital.com',
        speciality: 'Pediatrics',
        experience: 8,
        fees: 600,
        qualification: 'MBBS, MD Pediatrics, Fellowship in Pediatric Cardiology',
        hospitalId: hospitals[1].id
      },
      {
        name: 'Dr. Vikram Singh',
        email: 'vikram.singh@hospital.com',
        speciality: 'Dermatology',
        experience: 6,
        fees: 500,
        qualification: 'MBBS, MD Dermatology, Fellowship in Cosmetic Dermatology',
        hospitalId: hospitals[2].id
      },
      {
        name: 'Dr. Kavya Nair',
        email: 'kavya.nair@hospital.com',
        speciality: 'Gastroenterology',
        experience: 14,
        fees: 850,
        qualification: 'MBBS, MD Medicine, DM Gastroenterology',
        hospitalId: hospitals[2].id
      },
      {
        name: 'Dr. Arjun Mehta',
        email: 'arjun.mehta@hospital.com',
        speciality: 'Ophthalmology',
        experience: 9,
        fees: 650,
        qualification: 'MBBS, MS Ophthalmology, Fellowship in Retina',
        hospitalId: hospitals[3].id
      },
      {
        name: 'Dr. Deepika Joshi',
        email: 'deepika.joshi@hospital.com',
        speciality: 'ENT',
        experience: 7,
        fees: 550,
        qualification: 'MBBS, MS ENT, Fellowship in Head & Neck Surgery',
        hospitalId: hospitals[3].id
      },
      {
        name: 'Dr. Rohit Gupta',
        email: 'rohit.gupta@hospital.com',
        speciality: 'Pulmonology',
        experience: 11,
        fees: 750,
        qualification: 'MBBS, MD Medicine, DM Pulmonology',
        hospitalId: hospitals[4].id
      },
      {
        name: 'Dr. Meera Agarwal',
        email: 'meera.agarwal@hospital.com',
        speciality: 'Gynecology',
        experience: 13,
        fees: 700,
        qualification: 'MBBS, MS Obstetrics & Gynecology, Fellowship in IVF',
        hospitalId: hospitals[4].id
      },
      {
        name: 'Dr. Sanjay Verma',
        email: 'sanjay.verma@hospital.com',
        speciality: 'Urology',
        experience: 16,
        fees: 900,
        qualification: 'MBBS, MS General Surgery, MCh Urology',
        hospitalId: hospitals[5].id
      },
      {
        name: 'Dr. Anita Desai',
        email: 'anita.desai@hospital.com',
        speciality: 'Psychiatry',
        experience: 9,
        fees: 600,
        qualification: 'MBBS, MD Psychiatry, Fellowship in Child Psychiatry',
        hospitalId: hospitals[5].id
      },
      {
        name: 'Dr. Kiran Reddy',
        email: 'kiran.reddy@hospital.com',
        speciality: 'Oncology',
        experience: 18,
        fees: 1200,
        qualification: 'MBBS, MD Medicine, DM Medical Oncology',
        hospitalId: hospitals[0].id
      },
      {
        name: 'Dr. Ravi Shankar',
        email: 'ravi.shankar@hospital.com',
        speciality: 'Nephrology',
        experience: 12,
        fees: 800,
        qualification: 'MBBS, MD Medicine, DM Nephrology',
        hospitalId: hospitals[1].id
      },
      {
        name: 'Dr. Pooja Malhotra',
        email: 'pooja.malhotra@hospital.com',
        speciality: 'Endocrinology',
        experience: 10,
        fees: 700,
        qualification: 'MBBS, MD Medicine, DM Endocrinology',
        hospitalId: hospitals[2].id
      }
    ];

    const hashedPassword = await bcrypt.hash('doctor123', 10);

    for (const doctorInfo of doctorData) {
      // Create user
      const user = await prisma.user.create({
        data: {
          name: doctorInfo.name,
          email: doctorInfo.email,
          password: hashedPassword,
          phone: '+91-9876543210',
          role: 'DOCTOR'
        }
      });

      // Create doctor profile
      const doctor = await prisma.doctor.create({
        data: {
          userId: user.id,
          hospitalId: doctorInfo.hospitalId,
          speciality: doctorInfo.speciality,
          experience: doctorInfo.experience,
          fees: doctorInfo.fees,
          qualification: doctorInfo.qualification
        }
      });

      // Add doctor timings
      const timings = [
        { dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 'TUESDAY', startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 'WEDNESDAY', startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 'THURSDAY', startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 'FRIDAY', startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 'SATURDAY', startTime: '09:00', endTime: '13:00' }
      ];

      for (const timing of timings) {
        await prisma.doctorTiming.create({
          data: {
            doctorId: doctor.id,
            ...timing
          }
        });
      }
    }

    console.log('✅ Doctors created with timings');

    // Create sample patients
    const patientUsers = await Promise.all([
      prisma.user.create({
        data: {
          name: 'John Doe',
          email: 'john.doe@email.com',
          password: await bcrypt.hash('patient123', 10),
          phone: '+91-9876543220',
          role: 'PATIENT'
        }
      }),
      prisma.user.create({
        data: {
          name: 'Jane Smith',
          email: 'jane.smith@email.com',
          password: await bcrypt.hash('patient123', 10),
          phone: '+91-9876543221',
          role: 'PATIENT'
        }
      }),
      prisma.user.create({
        data: {
          name: 'Mike Johnson',
          email: 'mike.johnson@email.com',
          password: await bcrypt.hash('patient123', 10),
          phone: '+91-9876543222',
          role: 'PATIENT'
        }
      })
    ]);

    for (const patientUser of patientUsers) {
      await prisma.patient.create({
        data: {
          userId: patientUser.id,
          gender: 'Male',
          dob: new Date('1990-01-01')
        }
      });
    }

    console.log('✅ Sample patients created');

    // Create ambulances for hospitals
    for (let i = 0; i < hospitals.length; i++) {
      const hospital = hospitals[i];
      await prisma.ambulance.create({
        data: {
          vehicleNumber: `AMB-${hospital.city}-${String(i * 2 + 1).padStart(3, '0')}`,
          type: 'BASIC',
          hospitalId: hospital.id,
          isAvailable: true,
          location: hospital.city
        }
      });

      await prisma.ambulance.create({
        data: {
          vehicleNumber: `AMB-${hospital.city}-${String(i * 2 + 2).padStart(3, '0')}`,
          type: 'ADVANCED',
          hospitalId: hospital.id,
          isAvailable: true,
          location: hospital.city
        }
      });
    }

    console.log('✅ Ambulances created');

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created:`);
    console.log(`   - ${hospitals.length} hospitals`);
    console.log(`   - ${doctorData.length} doctors`);
    console.log(`   - ${patientUsers.length} patients`);
    console.log(`   - ${hospitals.length * 2} ambulances`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });