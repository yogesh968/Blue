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

module.exports = { getHospitals, getHospitalById, createHospitalProfile, updateHospital };