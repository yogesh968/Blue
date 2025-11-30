const express = require('express');
const { getDoctors, getDoctorById, updateDoctorProfile } = require('../controllers/doctorController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.put('/:id', authenticateToken, updateDoctorProfile);

module.exports = router;