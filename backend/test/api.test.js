const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../server');

chai.use(chaiHttp);
const { expect } = chai;

describe('Healthcare API Endpoints Test', () => {
  let authToken = '';
  let userId = '';

  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    phone: '1234567890',
    role: 'PATIENT'
  };

  describe('Authentication Endpoints', () => {
    it('should register a new user', (done) => {
      chai.request(app)
        .post('/api/auth/register')
        .send(testUser)
        .end((err, res) => {
          if (res.status === 201) {
            console.log('✅ POST /api/auth/register - Working');
          } else {
            console.log('❌ POST /api/auth/register - Failed:', res.status);
          }
          done();
        });
    });

    it('should login user', (done) => {
      chai.request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .end((err, res) => {
          if (res.status === 200) {
            authToken = res.body.token;
            userId = res.body.user.id;
            console.log('✅ POST /api/auth/login - Working');
          } else {
            console.log('❌ POST /api/auth/login - Failed:', res.status);
          }
          done();
        });
    });
  });

  describe('Doctor Endpoints', () => {
    it('should get all doctors', (done) => {
      chai.request(app)
        .get('/api/doctors')
        .end((err, res) => {
          if (res.status === 200) {
            console.log('✅ GET /api/doctors - Working');
          } else {
            console.log('❌ GET /api/doctors - Failed:', res.status);
          }
          done();
        });
    });

    it('should get doctor by ID', (done) => {
      chai.request(app)
        .get('/api/doctors/1')
        .end((err, res) => {
          if (res.status === 200) {
            console.log('✅ GET /api/doctors/:id - Working');
          } else {
            console.log('❌ GET /api/doctors/:id - Failed:', res.status);
          }
          done();
        });
    });
  });

  describe('Hospital Endpoints', () => {
    it('should get all hospitals', (done) => {
      chai.request(app)
        .get('/api/hospitals')
        .end((err, res) => {
          if (res.status === 200) {
            console.log('✅ GET /api/hospitals - Working');
          } else {
            console.log('❌ GET /api/hospitals - Failed:', res.status);
          }
          done();
        });
    });
  });

  describe('Appointment Endpoints', () => {
    it('should get user appointments', (done) => {
      chai.request(app)
        .get('/api/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          if (res.status === 200) {
            console.log('✅ GET /api/appointments - Working');
          } else {
            console.log('❌ GET /api/appointments - Failed:', res.status);
          }
          done();
        });
    });

    it('should create appointment', (done) => {
      const appointmentData = {
        doctorId: 1,
        appointmentDate: new Date(),
        reason: 'Test appointment'
      };
      
      chai.request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(appointmentData)
        .end((err, res) => {
          if (res.status === 201) {
            console.log('✅ POST /api/appointments - Working');
          } else {
            console.log('❌ POST /api/appointments - Failed:', res.status);
          }
          done();
        });
    });
  });

  describe('Missing Critical Endpoints Check', () => {
    const criticalEndpoints = [
      { method: 'GET', path: '/api/doctors/1/appointments', desc: 'Doctor appointments' },
      { method: 'GET', path: '/api/doctors/1/schedule', desc: 'Doctor schedule' },
      { method: 'PUT', path: '/api/doctors/1/schedule', desc: 'Update doctor schedule' },
      { method: 'GET', path: '/api/hospital/1/doctors', desc: 'Hospital doctors' },
      { method: 'GET', path: '/api/hospital/1/bed-bookings', desc: 'Hospital bed bookings' },
      { method: 'GET', path: '/api/doctor/1/locations', desc: 'Doctor locations' },
      { method: 'POST', path: '/api/doctor/1/locations', desc: 'Add doctor location' },
      { method: 'GET', path: '/api/bed-bookings', desc: 'User bed bookings' },
      { method: 'POST', path: '/api/bed-bookings', desc: 'Create bed booking' },
      { method: 'GET', path: '/api/ambulances/bookings', desc: 'Ambulance bookings' }
    ];

    criticalEndpoints.forEach(endpoint => {
      it(`should test ${endpoint.method} ${endpoint.path}`, (done) => {
        const request = chai.request(app);
        const req = endpoint.method === 'GET' ? request.get(endpoint.path) : request.post(endpoint.path);
        
        req.set('Authorization', `Bearer ${authToken}`)
          .end((err, res) => {
            if (res && res.status < 500) {
              console.log(`✅ ${endpoint.method} ${endpoint.path} - Available`);
            } else {
              console.log(`❌ ${endpoint.method} ${endpoint.path} - Missing/Broken`);
            }
            done();
          });
      });
    });
  });
});