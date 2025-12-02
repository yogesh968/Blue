const API_BASE_URL = 'http://localhost:3001/api';

// Add error handling wrapper
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }
  return response;
};

const api = {
  // Auth endpoints
  register: (userData) => 
    fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }),
  
  login: (credentials) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }),

  // Doctor endpoints
  getDoctors: (params = '') =>
    fetch(`${API_BASE_URL}/doctors${params}`),
  
  getDoctorById: (id) =>
    fetch(`${API_BASE_URL}/doctors/${id}`),

  // Hospital endpoints
  getHospitals: (params = '') =>
    fetch(`${API_BASE_URL}/hospitals${params}`),
  
  getHospitalById: (id) =>
    fetch(`${API_BASE_URL}/hospitals/${id}`),

  // Appointment endpoints
  createAppointment: (appointmentData, token) =>
    fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(appointmentData)
    }),

  getAppointments: (token) =>
    fetch(`${API_BASE_URL}/appointments`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  // Payment endpoints
  createPayment: (paymentData, token) =>
    fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData)
    }),

  // Doctor Location endpoints
  getDoctorLocations: (doctorId, token) =>
    fetch(`${API_BASE_URL}/doctor/${doctorId}/locations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(handleResponse).catch(err => {
      console.error('API Error:', err);
      return { ok: false, json: () => Promise.resolve([]) };
    }),

  addDoctorLocation: (doctorId, locationData, token) =>
    fetch(`${API_BASE_URL}/doctor/${doctorId}/locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(locationData)
    }),

  updateDoctorLocation: (locationId, locationData, token) =>
    fetch(`${API_BASE_URL}/locations/${locationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(locationData)
    }),

  deleteDoctorLocation: (locationId, token) =>
    fetch(`${API_BASE_URL}/locations/${locationId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  getDoctorAppointments: (doctorId, date, token) =>
    fetch(`${API_BASE_URL}/doctors/${doctorId}/appointments${date ? `?date=${date}` : ''}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  // Patient endpoints
  createPatientProfile: (profileData, token) =>
    fetch(`${API_BASE_URL}/patients/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    }),

  getPatientProfile: (token) =>
    fetch(`${API_BASE_URL}/patients/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  addMedicalRecord: (recordData, token) =>
    fetch(`${API_BASE_URL}/patients/medical-records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(recordData)
    }),

  // Bed booking endpoints
  createBedBooking: (bookingData, token) =>
    fetch(`${API_BASE_URL}/bed-bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    }),

  getBedBookings: (token) =>
    fetch(`${API_BASE_URL}/bed-bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  getBedAvailability: (hospitalId) =>
    fetch(`${API_BASE_URL}/bed-bookings/availability/${hospitalId}`),

  // Ambulance endpoints
  createAmbulanceBooking: (bookingData, token) =>
    fetch(`${API_BASE_URL}/ambulances/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    }),

  getAmbulanceBookings: (token) =>
    fetch(`${API_BASE_URL}/ambulances/bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  getAvailableAmbulances: () =>
    fetch(`${API_BASE_URL}/ambulances/available`),

  // Doctor Schedule endpoints
  getDoctorSchedule: (doctorId, token) =>
    fetch(`${API_BASE_URL}/doctors/${doctorId}/schedule`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  updateDoctorSchedule: (doctorId, scheduleData, token) =>
    fetch(`${API_BASE_URL}/doctors/${doctorId}/schedule`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(scheduleData)
    }),

  // Hospital Management endpoints
  getHospitalDoctors: (hospitalId, token) =>
    fetch(`${API_BASE_URL}/hospital/${hospitalId}/doctors`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  getHospitalBedBookings: (hospitalId, token) =>
    fetch(`${API_BASE_URL}/hospital/${hospitalId}/bed-bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  getHospitalAmbulanceBookings: (hospitalId, token) =>
    fetch(`${API_BASE_URL}/hospital/${hospitalId}/ambulance-bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  updateBedBookingStatus: (bookingId, status, token) =>
    fetch(`${API_BASE_URL}/bed-bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    }),

  updateAmbulanceBookingStatus: (bookingId, status, token) =>
    fetch(`${API_BASE_URL}/ambulances/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    }),

  incrementLocationPatientCount: (locationId, token) =>
    fetch(`${API_BASE_URL}/locations/${locationId}/increment-patient`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }),

  updateAppointmentStatus: (appointmentId, status, token) =>
    fetch(`${API_BASE_URL}/appointments/${appointmentId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    }),

  createDoctorProfile: (profileData, token) =>
    fetch(`${API_BASE_URL}/doctors/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    }).then(handleResponse).catch(err => {
      console.error('Profile creation error:', err);
      throw err;
    })
};

export default api;