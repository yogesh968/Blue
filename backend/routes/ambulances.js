const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { createAmbulanceBooking, getAmbulanceBookings, updateAmbulanceBooking, getAvailableAmbulances } = require('../controllers/ambulanceController');

const router = express.Router();

router.post('/bookings', authenticateToken, createAmbulanceBooking);
router.get('/bookings', authenticateToken, getAmbulanceBookings);
router.put('/bookings/:id', authenticateToken, updateAmbulanceBooking);
router.get('/available', getAvailableAmbulances);

module.exports = router;