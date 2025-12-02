const { app } = require('./server');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

async function testDoctorLogin() {
  console.log('👨‍⚕️ Testing Doctor Login Flow...\n');

  try {
    // 1. Register a doctor
    console.log('1. Registering a doctor...');
    const doctorData = {
      name: 'Dr. Test Doctor',
      email: `doctor${Date.now()}@example.com`,
      password: 'password123',
      phone: '9876543210',
      role: 'DOCTOR'
    };

    const registerRes = await chai.request(app)
      .post('/api/auth/register')
      .send(doctorData);

    console.log('Register Response:', registerRes.status, registerRes.body);

    if (registerRes.status === 201) {
      // 2. Login as doctor
      console.log('\n2. Logging in as doctor...');
      const loginRes = await chai.request(app)
        .post('/api/auth/login')
        .send({
          email: doctorData.email,
          password: doctorData.password
        });

      console.log('Login Response:', loginRes.status, loginRes.body);

      if (loginRes.status === 200) {
        const token = loginRes.body.token;
        
        // 3. Check if doctor profile exists
        console.log('\n3. Checking doctor profile...');
        const profileRes = await chai.request(app)
          .get('/api/doctors/profile/me')
          .set('Authorization', `Bearer ${token}`);

        console.log('Profile Response:', profileRes.status, profileRes.body);

        if (profileRes.status === 404) {
          // 4. Create doctor profile
          console.log('\n4. Creating doctor profile...');
          const createProfileRes = await chai.request(app)
            .post('/api/doctors/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({
              speciality: 'General Medicine',
              experience: 5,
              fees: 500,
              qualification: 'MBBS'
            });

          console.log('Create Profile Response:', createProfileRes.status, createProfileRes.body);
        }

        console.log('\n✅ Doctor login flow completed successfully!');
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDoctorLogin();