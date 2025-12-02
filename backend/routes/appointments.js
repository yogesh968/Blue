const express = require('express');
const { createAppointment, getAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticateToken, createAppointment);
router.get('/', authenticateToken, getAppointments);
router.get('/doctor/:doctorId', authenticateToken, getAppointments);
router.put('/:id/status', authenticateToken, updateAppointmentStatus);

module.exports = router;