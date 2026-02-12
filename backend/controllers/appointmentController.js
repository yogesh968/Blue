const { prisma } = require('../db/config');
const { sendAppointmentNotification } = require('./notificationController');


const createAppointment = async (req, res) => {
  try {
    let { patientId, doctorId, appointmentDate, reason } = req.body;

    // If patientId not provided, get from authenticated user
    if (!patientId && req.user) {
      const patient = await prisma.patient.findUnique({ where: { userId: req.user.userId } });
      if (patient) {
        patientId = patient.id;
      } else {
        // Verify user exists before creating patient profile
        const userExists = await prisma.user.findUnique({ where: { id: req.user.userId } });
        if (!userExists) {
          return res.status(401).json({ error: 'User account not found. Please login again.' });
        }

        // Create patient profile if it doesn't exist
        const newPatient = await prisma.patient.create({
          data: {
            userId: req.user.userId,
            gender: 'OTHER',
            medicalHistory: {}
          }
        });
        patientId = newPatient.id;
      }
    }

    if (!patientId || !doctorId || !appointmentDate || !reason) {
      return res.status(400).json({ error: 'PatientId, doctorId, appointmentDate, and reason are required' });
    }

    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });

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

    // Create a pending payment record
    if (doctor && doctor.fees) {
      await prisma.payment.create({
        data: {
          appointmentId: appointment.id,
          amount: parseFloat(doctor.fees),
          paymentStatus: 'PENDING',
          paymentMethod: 'CASH' // Default
        }
      });
    }


    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment', details: error.message });
  }
};

const getAppointments = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;
    const { doctorId } = req.params;

    let where = {};

    // If doctorId is provided in params, use it directly
    if (doctorId) {
      where.doctorId = doctorId;
    } else if (role === 'PATIENT') {
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