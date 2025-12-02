const express = require('express');
const { 
  getDoctors, 
  getDoctorById, 
  getDoctorAvailability, 
  createDoctorProfile, 
  updateDoctorProfile,
  getDoctorInvitations,
  respondToInvitation,
  getCurrentDoctorProfile
} = require('../controllers/doctorController');
const { authenticateToken } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.get('/', getDoctors);
router.get('/profile/me', authenticateToken, getCurrentDoctorProfile);
router.get('/:id', getDoctorById);
router.get('/:id/availability', getDoctorAvailability);
router.post('/profile', authenticateToken, createDoctorProfile);
router.put('/:id', authenticateToken, updateDoctorProfile);

// Doctor invitations
router.get('/invitations/pending', authenticateToken, getDoctorInvitations);
router.put('/invitations/:invitationId/respond', authenticateToken, respondToInvitation);

// Get doctor appointments
router.get('/:doctorId/appointments', authenticateToken, async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    const whereClause = {
      doctorId: parseInt(doctorId)
    };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
      whereClause.appointmentDate = {
        gte: startDate,
        lte: endDate
      };
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: {
          include: {
            user: true
          }
        },
        doctor: {
          include: {
            hospital: true
          }
        }
      },
      orderBy: {
        appointmentDate: 'asc'
      }
    });

    const formattedAppointments = appointments.map(apt => ({
      id: apt.id,
      patientName: apt.patient.user.name,
      patientAge: 'N/A',
      appointmentTime: apt.appointmentDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      date: apt.appointmentDate.toISOString().split('T')[0],
      location: apt.doctor.hospital ? `${apt.doctor.hospital.name}, ${apt.doctor.hospital.city}` : 'Not specified',
      symptoms: apt.reason,
      status: apt.status.toLowerCase(),
      fees: apt.doctor.fees
    }));

    res.json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

module.exports = router;