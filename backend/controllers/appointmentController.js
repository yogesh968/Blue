const { prisma } = require('../db/config');
const { sendAppointmentNotification } = require('./notificationController');

const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, reason } = req.body;

    const appointment = await prisma.appointment.create({
      data: {
        patientId: parseInt(patientId),
        doctorId: parseInt(doctorId),
        appointmentDate: new Date(appointmentDate),
        reason,
        status: 'PENDING'
      },
      include: {
        doctor: { include: { user: { select: { name: true } } } },
        patient: { include: { user: { select: { name: true } } } }
      }
    });

    // Send notification
    await sendAppointmentNotification(appointment.id, 'CONFIRMED');

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create appointment' });
  }
};

const getAppointments = async (req, res) => {
  try {
    const { userId, role } = req.user;
    
    let where = {};
    if (role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      where.patientId = patient?.id;
    } else if (role === 'DOCTOR') {
      const doctor = await prisma.doctor.findUnique({ where: { userId } });
      where.doctorId = doctor?.id;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        doctor: { include: { user: { select: { name: true } } } },
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
      where: { id: parseInt(id) },
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