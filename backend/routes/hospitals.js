const express = require('express');
const { getHospitals, getHospitalById, createHospitalProfile, updateHospital } = require('../controllers/hospitalController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/', getHospitals);
router.get('/:id', getHospitalById);
router.post('/profile', authenticateToken, createHospitalProfile);
router.put('/:id', authenticateToken, updateHospital);

module.exports = router;