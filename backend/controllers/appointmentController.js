const { prisma } = require('../db/config');
const { sendAppointmentNotification } = require('./notificationController');

const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, reason } = req.body;

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        appointmentDate: new Date(appointmentDate),
        reason,
        status: 'PENDING'
      },
      include: {
        doctor: { include: { user: { select: { name: true } } } },
        patient: { include: { user: { select: { name: true } } } }
      }
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment', details: error.message });
  }
};

const getAppointments = async (req, res) => {
  try {
    const { userId, role } = req.user;
    
    let where = {};
    if (role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (!patient) {
        return res.json([]);
      }
      where.patientId = patient.id;
    } else if (role === 'DOCTOR') {
      const doctor = await prisma.doctor.findUnique({ where: { userId } });
      if (!doctor) {
        return res.json([]);
      }
      where.doctorId = doctor.id;
    } else {
      return res.json([]);
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        doctor: { 
          include: { 
            user: { select: { name: true } },
            hospital: { select: { name: true, city: true } }
          } 
        },
        patient: { include: { user: { select: { name: true } } } },
        payment: true
      },
      orderBy: { appointmentDate: 'asc' }
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        doctor: { include: { user: { select: { name: true } } } },
        patient: { include: { user: { select: { name: true } } } }
      }
    });

    // Send notification for status change
    if (status === 'CONFIRMED' || status === 'CANCELLED') {
      await sendAppointmentNotification(appointment.id, status);
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update appointment' });
  }
};

module.exports = { createAppointment, getAppointments, updateAppointmentStatus };