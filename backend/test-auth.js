const { app } = require('./server');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

async function testAuth() {
  console.log('🔐 Testing Authentication...\n');

  try {
    // Test registration
    console.log('1. Testing Registration...');
    const userData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      phone: '1234567890',
      role: 'PATIENT'
    };

    const registerRes = await chai.request(app)
      .post('/api/auth/register')
      .send(userData);

    console.log('Register Response:', registerRes.status, registerRes.body);

    if (registerRes.status === 201) {
      console.log('✅ Registration successful');
      
      // Test login
      console.log('\n2. Testing Login...');
      const loginRes = await chai.request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        });

      console.log('Login Response:', loginRes.status, loginRes.body);

      if (loginRes.status === 200) {
        console.log('✅ Login successful');
        console.log('Token:', loginRes.body.token);
      } else {
        console.log('❌ Login failed');
      }
    } else {
      console.log('❌ Registration failed');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAuth();