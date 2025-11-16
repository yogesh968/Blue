const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { createPatientProfile, getPatientProfile, updatePatientProfile, addMedicalRecord } = require('../controllers/patientController');

const router = express.Router();

router.post('/profile', authenticateToken, createPatientProfile);
router.get('/profile', authenticateToken, getPatientProfile);
router.put('/profile', authenticateToken, updatePatientProfile);
router.post('/medical-records', authenticateToken, addMedicalRecord);

module.exports = router;