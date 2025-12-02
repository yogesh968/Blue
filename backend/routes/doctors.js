const express = require('express');
const { getDoctors, getDoctorById, getDoctorAvailability, createDoctorProfile, updateDoctorProfile } = require('../controllers/doctorController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/availability', getDoctorAvailability);
router.post('/profile', authenticateToken, createDoctorProfile);
router.put('/:id', authenticateToken, updateDoctorProfile);

module.exports = router;