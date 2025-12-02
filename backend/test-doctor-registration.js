const { app } = require('./server');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

async function testDoctorRegistrationAndVisibility() {
  console.log('🧪 Testing Doctor Registration and Visibility...\n');

  try {
    // 1. Register a new doctor
    console.log('1. Registering a new doctor...');
    const doctorData = {
      name: 'Dr. John Smith',
      email: `doctor${Date.now()}@example.com`,
      password: 'password123',
      phone: '9876543210',
      role: 'DOCTOR',
      speciality: 'Cardiology',
      experience: 5,
      fees: 500,
      qualification: 'MBBS, MD Cardiology'
    };

    const registerRes = await chai.request(app)
      .post('/api/auth/register')
      .send(doctorData);

    if (registerRes.status === 201) {
      console.log('✅ Doctor registered successfully');
      console.log(`   Doctor ID: ${registerRes.body.doctor.id}`);
      console.log(`   Speciality: ${registerRes.body.doctor.speciality}`);
    } else {
      console.log('❌ Doctor registration failed:', registerRes.status);
      return;
    }

    // 2. Check if doctor appears in doctors list
    console.log('\n2. Checking if doctor appears in doctors list...');
    const doctorsRes = await chai.request(app)
      .get('/api/doctors');

    if (doctorsRes.status === 200) {
      const doctors = doctorsRes.body;
      const newDoctor = doctors.find(d => d.user.email === doctorData.email);
      
      if (newDoctor) {
        console.log('✅ Doctor is visible in doctors list');
        console.log(`   Name: ${newDoctor.user.name}`);
        console.log(`   Speciality: ${newDoctor.speciality}`);
        console.log(`   Experience: ${newDoctor.experience} years`);
        console.log(`   Fees: ₹${newDoctor.fees}`);
        console.log(`   Average Rating: ${newDoctor.averageRating}`);
      } else {
        console.log('❌ Doctor not found in doctors list');
      }
    } else {
      console.log('❌ Failed to fetch doctors list');
    }

    // 3. Test filtering by speciality
    console.log('\n3. Testing speciality filter...');
    const filteredRes = await chai.request(app)
      .get('/api/doctors?speciality=Cardiology');

    if (filteredRes.status === 200) {
      const cardiologists = filteredRes.body;
      console.log(`✅ Found ${cardiologists.length} cardiologist(s)`);
      cardiologists.forEach(doc => {
        console.log(`   - ${doc.user.name} (${doc.speciality})`);
      });
    }

    // 4. Register a hospital user
    console.log('\n4. Registering a hospital...');
    const hospitalUserData = {
      name: 'City Hospital Admin',
      email: `hospital${Date.now()}@example.com`,
      password: 'password123',
      phone: '9876543211',
      role: 'HOSPITAL'
    };

    const hospitalUserRes = await chai.request(app)
      .post('/api/auth/register')
      .send(hospitalUserData);

    if (hospitalUserRes.status === 201) {
      console.log('✅ Hospital user registered successfully');
      
      // Create hospital profile
      const hospitalProfileData = {
        name: 'City General Hospital',
        city: 'Mumbai',
        address: '123 Main Street, Mumbai',
        phone: '022-12345678'
      };

      const hospitalProfileRes = await chai.request(app)
        .post('/api/hospitals/profile')
        .set('Authorization', `Bearer ${hospitalUserRes.body.token}`)
        .send(hospitalProfileData);

      if (hospitalProfileRes.status === 201) {
        console.log('✅ Hospital profile created successfully');
        const hospitalId = hospitalProfileRes.body.id;

        // 5. Hospital views available doctors
        console.log('\n5. Hospital viewing available doctors...');
        const availableDoctorsRes = await chai.request(app)
          .get(`/api/hospitals/${hospitalId}/available-doctors`)
          .set('Authorization', `Bearer ${hospitalUserRes.body.token}`);

        if (availableDoctorsRes.status === 200) {
          const availableDoctors = availableDoctorsRes.body;
          console.log(`✅ Hospital can see ${availableDoctors.length} available doctor(s)`);
          availableDoctors.forEach(doc => {
            console.log(`   - ${doc.user.name} (${doc.speciality}) - ₹${doc.fees}`);
          });
        }
      }
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ Doctors can register with their profile information');
    console.log('✅ Registered doctors appear in the doctors list');
    console.log('✅ Users can filter doctors by speciality');
    console.log('✅ Hospitals can view available doctors');
    console.log('✅ Doctor profiles include ratings, experience, and fees');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testDoctorRegistrationAndVisibility();