const { prisma } = require('../db/config');

const getDoctors = async (req, res) => {
  try {
    const { specialty, search } = req.query;
    
    const where = {};
    if (specialty) where.speciality = { contains: specialty };
    if (search) {
      where.OR = [
        { user: { name: { contains: search } } },
        { speciality: { contains: search } }
      ];
    }

    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, phone: true } },
        hospital: { select: { name: true, city: true, address: true } },
        reviews: { select: { rating: true } }
      }
    });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(id) },
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
        hospitalId: parseInt(hospitalId),
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
      where: { id: parseInt(id) },
      data: { speciality, experience, fees, qualification },
      include: { user: { select: { name: true, email: true } } }
    });

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

module.exports = { getDoctors, getDoctorById, createDoctorProfile, updateDoctorProfile };