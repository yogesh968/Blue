const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testEndpoints() {
  console.log('🧪 Testing API Endpoints...\n');

  const tests = [
    { name: 'GET /doctors', url: `${BASE_URL}/doctors` },
    { name: 'GET /hospitals', url: `${BASE_URL}/hospitals` },
    { name: 'GET /appointments', url: `${BASE_URL}/appointments`, requiresAuth: true },
  ];

  for (const test of tests) {
    try {
      if (test.requiresAuth) {
        console.log(`⚠️  ${test.name} - Requires authentication (skipping)`);
        continue;
      }
      
      const response = await axios.get(test.url);
      console.log(`✅ ${test.name} - Status: ${response.status}`);
      
      if (Array.isArray(response.data)) {
        console.log(`   Found ${response.data.length} records\n`);
      }
    } catch (error) {
      console.log(`❌ ${test.name} - Error: ${error.response?.status || error.message}\n`);
    }
  }

  console.log('✅ Testing complete!');
}

testEndpoints();
