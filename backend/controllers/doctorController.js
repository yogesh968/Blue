const { prisma } = require('../db/config');

const getDoctors = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
        hospital: true
      }
    });

    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors', details: error.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        hospital: true,
        timings: true,
        reviews: { include: { patient: { include: { user: { select: { name: true } } } } } }
      }
    });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctor' });
  }
};

const createDoctorProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const { hospitalId, speciality, experience, fees, qualification } = req.body;

    const existingDoctor = await prisma.doctor.findUnique({ where: { userId } });
    if (existingDoctor) {
      return res.status(400).json({ error: 'Doctor profile already exists' });
    }

    const doctor = await prisma.doctor.create({
      data: {
        userId,
        hospitalId,
        speciality,
        experience: parseInt(experience),
        fees: parseInt(fees),
        qualification
      },
      include: {
        user: { select: { name: true, email: true } },
        hospital: { select: { name: true, city: true } }
      }
    });

    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create doctor profile' });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { speciality, experience, fees, qualification } = req.body;

    const doctor = await prisma.doctor.update({
      where: { id },
      data: { speciality, experience, fees, qualification },
      include: { user: { select: { name: true, email: true } } }
    });

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

const getDoctorAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }
    
    // Get doctor's existing appointments for the date
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        doctorId: id,
        appointmentDate: {
          gte: new Date(`${date}T00:00:00.000Z`),
          lt: new Date(`${date}T23:59:59.999Z`)
        },
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      },
      select: {
        appointmentDate: true
      }
    });
    
    // Generate all possible time slots
    const allSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];
    
    // Filter out booked slots
    const bookedTimes = existingAppointments.map(apt => {
      const time = new Date(apt.appointmentDate).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      return time;
    });
    
    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));
    
    res.json({ availableSlots });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
};

module.exports = { getDoctors, getDoctorById, getDoctorAvailability, createDoctorProfile, updateDoctorProfile };