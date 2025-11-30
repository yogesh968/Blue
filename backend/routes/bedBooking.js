const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { createBedBooking, getBedBookings, updateBedBooking, getAvailableBeds } = require('../controllers/bedBookingController');

const router = express.Router();

router.post('/', authenticateToken, createBedBooking);
router.get('/', authenticateToken, getBedBookings);
router.put('/:id', authenticateToken, updateBedBooking);
router.get('/availability/:hospitalId', getAvailableBeds);

module.exports = router;