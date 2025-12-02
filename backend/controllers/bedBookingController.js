const { prisma } = require('../db/config');

const createBedBooking = async (req, res) => {
  try {
    let { hospitalId, bedType, admissionDate, patientId, totalAmount } = req.body;
    
    // If patientId not provided, get from authenticated user
    if (!patientId && req.user) {
      const patient = await prisma.patient.findUnique({ where: { userId: req.user.userId } });
      if (patient) {
        patientId = patient.id;
      }
    }
    
    // Validate required fields
    if (!patientId || !hospitalId || !bedType || !admissionDate) {
      return res.status(400).json({ error: 'PatientId, hospitalId, bedType, and admissionDate are required' });
    }

    const booking = await prisma.bedBooking.create({
      data: {
        patientId: parseInt(patientId),
        hospitalId: parseInt(hospitalId),
        bedType,
        admissionDate: new Date(admissionDate),
        totalAmount: totalAmount ? parseFloat(totalAmount) : null,
        status: 'PENDING'
      },
      include: {
        hospital: { select: { name: true, address: true } },
        patient: { include: { user: { select: { name: true, phone: true } } } }
      }
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating bed booking:', error);
    res.status(500).json({ error: 'Failed to create bed booking' });
  }
};

const getBedBookings = async (req, res) => {
  try {
    const { userId, role } = req.user;
    
    let where = {};
    if (role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      where.patientId = patient?.id;
    } else if (role === 'HOSPITAL') {
      where.hospitalId = parseInt(req.query.hospitalId);
    }

    const bookings = await prisma.bedBooking.findMany({
      where,
      include: {
        hospital: { select: { name: true, address: true, city: true } },
        patient: { include: { user: { select: { name: true, phone: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bed bookings' });
  }
};

const updateBedBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, checkOut } = req.body;

    const updateData = { status };
    if (checkOut) updateData.checkOut = new Date(checkOut);

    const booking = await prisma.bedBooking.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        hospital: { select: { name: true } },
        patient: { include: { user: { select: { name: true } } } }
      }
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update bed booking' });
  }
};

const getAvailableBeds = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    
    const hospital = await prisma.hospital.findUnique({
      where: { id: parseInt(hospitalId) },
      select: { beds: true, name: true }
    });

    const activeBeds = await prisma.bedBooking.count({
      where: { 
        hospitalId: parseInt(hospitalId),
        status: 'ACTIVE'
      }
    });

    const availableBeds = hospital.beds - activeBeds;

    res.json({
      totalBeds: hospital.beds,
      occupiedBeds: activeBeds,
      availableBeds: Math.max(0, availableBeds),
      hospitalName: hospital.name
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bed availability' });
  }
};

module.exports = { createBedBooking, getBedBookings, updateBedBooking, getAvailableBeds };