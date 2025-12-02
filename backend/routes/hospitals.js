const express = require('express');
const { 
  getHospitals, 
  getHospitalById, 
  createHospitalProfile, 
  updateHospital,
  getAvailableDoctors,
  inviteDoctor
} = require('../controllers/hospitalController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/', getHospitals);
router.get('/:id', getHospitalById);
router.post('/profile', authenticateToken, createHospitalProfile);
router.put('/:id', authenticateToken, updateHospital);

// Hospital-Doctor management
router.get('/:hospitalId/available-doctors', authenticateToken, getAvailableDoctors);
router.post('/invite-doctor', authenticateToken, inviteDoctor);

module.exports = router;