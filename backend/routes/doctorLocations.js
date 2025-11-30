const express = require('express');
const router = express.Router();
const {
  getDoctorLocations,
  addDoctorLocation,
  updateDoctorLocation,
  deleteDoctorLocation,
  getDoctorAppointments
} = require('../controllers/doctorLocationController');
const { authenticateToken } = require('../middleware/auth');

// Get all locations for a doctor
router.get('/doctor/:doctorId/locations', authenticateToken, getDoctorLocations);

// Add new location for doctor
router.post('/doctor/:doctorId/locations', authenticateToken, addDoctorLocation);

// Update doctor location
router.put('/locations/:locationId', authenticateToken, updateDoctorLocation);

// Delete doctor location
router.delete('/locations/:locationId', authenticateToken, deleteDoctorLocation);

// Get doctor appointments
router.get('/doctor/:doctorId/appointments', authenticateToken, getDoctorAppointments);

module.exports = router;