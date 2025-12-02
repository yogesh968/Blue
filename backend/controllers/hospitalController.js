const { prisma } = require('../db/config');

const getHospitals = async (req, res) => {
  try {
    const { city, search } = req.query;
    
    const where = {};
    if (city) where.city = { contains: city };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { address: { contains: search } }
      ];
    }

    const hospitals = await prisma.hospital.findMany({
      where,
      include: {
        doctors: {
          include: {
            user: { select: { name: true } },
            reviews: { select: { rating: true } }
          }
        }
      }
    });

    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
};

const getHospitalById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const hospital = await prisma.hospital.findUnique({
      where: { id: parseInt(id) },
      include: {
        doctors: {
          include: {
            user: { select: { name: true } },
            reviews: { select: { rating: true } }
          }
        }
      }
    });

    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    res.json(hospital);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hospital' });
  }
};

const createHospitalProfile = async (req, res) => {
  try {
    const { name, city, address, phone } = req.body;

    const hospital = await prisma.hospital.create({
      data: { name, city, address, phone }
    });

    res.status(201).json(hospital);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create hospital profile' });
  }
};

const updateHospital = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, city, address, phone } = req.body;

    const hospital = await prisma.hospital.update({
      where: { id: parseInt(id) },
      data: { name, city, address, phone }
    });

    res.json(hospital);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update hospital' });
  }
};

// Get available doctors for hospital to invite
const getAvailableDoctors = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { speciality } = req.query;
    
    let where = {
      OR: [
        { hospitalId: null }, // Doctors not affiliated with any hospital
        { hospitalId: { not: parseInt(hospitalId) } } // Doctors from other hospitals
      ]
    };
    
    if (speciality) {
      where.speciality = { contains: speciality };
    }

    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, phone: true } },
        hospital: { select: { name: true, city: true } },
        reviews: { select: { rating: true } },
        _count: { select: { appointments: true } }
      }
    });

    const doctorsWithStats = doctors.map(doctor => {
      const avgRating = doctor.reviews.length > 0 
        ? doctor.reviews.reduce((sum, review) => sum + review.rating, 0) / doctor.reviews.length
        : 0;
      
      return {
        ...doctor,
        averageRating: Math.round(avgRating * 10) / 10,
        totalAppointments: doctor._count.appointments
      };
    });

    res.json(doctorsWithStats);
  } catch (error) {
    console.error('Error fetching available doctors:', error);
    res.status(500).json({ error: 'Failed to fetch available doctors' });
  }
};

// Send invitation to doctor
const inviteDoctor = async (req, res) => {
  try {
    const { hospitalId, doctorId } = req.body;
    
    // Check if invitation already exists
    const existingInvitation = await prisma.doctorInvitation.findFirst({
      where: {
        hospitalId: parseInt(hospitalId),
        doctorId: parseInt(doctorId),
        status: 'PENDING'
      }
    });
    
    if (existingInvitation) {
      return res.status(400).json({ error: 'Invitation already sent to this doctor' });
    }

    const invitation = await prisma.doctorInvitation.create({
      data: {
        hospitalId: parseInt(hospitalId),
        doctorId: parseInt(doctorId),
        status: 'PENDING'
      },
      include: {
        hospital: { select: { name: true, city: true } },
        doctor: { include: { user: { select: { name: true, email: true } } } }
      }
    });

    res.status(201).json({
      message: 'Invitation sent successfully',
      invitation
    });
  } catch (error) {
    console.error('Error sending invitation:', error);
    res.status(500).json({ error: 'Failed to send invitation' });
  }
};

module.exports = { 
  getHospitals, 
  getHospitalById, 
  createHospitalProfile, 
  updateHospital,
  getAvailableDoctors,
  inviteDoctor
};