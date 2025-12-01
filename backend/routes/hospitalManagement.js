const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Get hospital doctors
router.get('/hospital/:hospitalId/doctors', authenticateToken, async (req, res) => {
  try {
    const { hospitalId } = req.params;
    
    const doctors = await prisma.doctor.findMany({
      where: { hospitalId: parseInt(hospitalId) },
      include: {
        user: { select: { name: true, email: true, phone: true } }
      }
    });
    
    const formattedDoctors = doctors.map(doctor => ({
      id: doctor.id,
      name: doctor.user.name,
      specialization: doctor.speciality,
      designation: 'Consultant', // This could be added to the schema
      experience: `${doctor.experience} years`,
      qualification: doctor.qualification,
      phone: doctor.user.phone,
      email: doctor.user.email,
      status: 'ACTIVE',
      joinDate: doctor.createdAt
    }));
    
    res.json(formattedDoctors);
  } catch (error) {
    console.error('Error fetching hospital doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// Get hospital bed bookings
router.get('/hospital/:hospitalId/bed-bookings', authenticateToken, async (req, res) => {
  try {
    const { hospitalId } = req.params;
    
    const bedBookings = await prisma.bedBooking.findMany({
      where: { hospitalId: parseInt(hospitalId) },
      include: {
        patient: {
          include: { user: true }
        }
      }
    });
    
    const formattedBookings = bedBookings.map(booking => ({
      id: booking.id,
      patientName: booking.patient.user.name,
      bedType: booking.bedType,
      checkIn: booking.admissionDate.toISOString().split('T')[0],
      status: booking.status,
      amount: booking.charges.bedCharge,
      room: booking.roomNumber || 'N/A'
    }));
    
    res.json(formattedBookings);
  } catch (error) {
    console.error('Error fetching bed bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bed bookings' });
  }
});

// Get hospital ambulance bookings
router.get('/hospital/:hospitalId/ambulance-bookings', authenticateToken, async (req, res) => {
  try {
    const { hospitalId } = req.params;
    
    const ambulanceBookings = await prisma.ambulanceBooking.findMany({
      where: { hospitalId: parseInt(hospitalId) },
      include: {
        patient: {
          include: { user: true }
        }
      }
    });
    
    const formattedBookings = ambulanceBookings.map(booking => ({
      id: booking.id,
      patientName: booking.patient.user.name,
      pickupLocation: booking.pickupLocation,
      destination: booking.destination,
      status: booking.status,
      ambulanceNo: booking.ambulanceNumber || 'N/A',
      driverName: booking.driverName || 'N/A'
    }));
    
    res.json(formattedBookings);
  } catch (error) {
    console.error('Error fetching ambulance bookings:', error);
    res.status(500).json({ error: 'Failed to fetch ambulance bookings' });
  }
});

// Update bed booking status
router.put('/bed-bookings/:bookingId/status', authenticateToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    
    const updatedBooking = await prisma.bedBooking.update({
      where: { id: parseInt(bookingId) },
      data: { status }
    });
    
    res.json({ message: 'Bed booking status updated', booking: updatedBooking });
  } catch (error) {
    console.error('Error updating bed booking status:', error);
    res.status(500).json({ error: 'Failed to update bed booking status' });
  }
});

// Update ambulance booking status
router.put('/ambulances/bookings/:bookingId/status', authenticateToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    
    const updatedBooking = await prisma.ambulanceBooking.update({
      where: { id: parseInt(bookingId) },
      data: { status }
    });
    
    res.json({ message: 'Ambulance booking status updated', booking: updatedBooking });
  } catch (error) {
    console.error('Error updating ambulance booking status:', error);
    res.status(500).json({ error: 'Failed to update ambulance booking status' });
  }
});

// Send doctor invitation
router.post('/hospital/:hospitalId/invite-doctor', authenticateToken, async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { doctorId } = req.body;
    
    // Create a notification or invitation record
    const invitation = await prisma.doctorInvitation.create({
      data: {
        hospitalId: parseInt(hospitalId),
        doctorId: parseInt(doctorId),
        status: 'PENDING'
      }
    });
    
    res.json({ message: 'Invitation sent successfully', invitation });
  } catch (error) {
    console.error('Error sending doctor invitation:', error);
    res.status(500).json({ error: 'Failed to send invitation' });
  }
});

module.exports = router;