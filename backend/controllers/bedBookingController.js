const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createBedBooking = async (req, res) => {
  try {
    let { hospitalId, bedType, admissionDate, patientName, reason } = req.body;
    
    // Get patient from authenticated user
    let patientId;
    if (req.user) {
      const patient = await prisma.patient.findUnique({ where: { userId: req.user.userId } });
      if (patient) {
        patientId = patient.id;
      }
    }
    
    // Validate required fields
    if (!patientId || !hospitalId || !bedType || !admissionDate) {
      return res.status(400).json({ error: 'Patient, hospital, bed type, and admission date are required' });
    }

    const booking = await prisma.bedBooking.create({
      data: {
        patientId,
        hospitalId,
        bedType,
        admissionDate: new Date(admissionDate),
        status: 'PENDING'
      },
      include: {
        hospital: { select: { name: true, address: true, city: true } },
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
    const userId = req.user?.userId;
    const role = req.user?.role;

    let where = {};
    if (role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (patient) {
        where.patientId = patient.id;
      }
    } else if (role === 'HOSPITAL') {
      where.hospitalId = req.query.hospitalId;
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
    console.error('Error fetching bed bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bed bookings' });
  }
};

const updateBedBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, dischargeDate } = req.body;

    const updateData = { status };
    if (dischargeDate) updateData.dischargeDate = new Date(dischargeDate);

    const booking = await prisma.bedBooking.update({
      where: { id },
      data: updateData,
      include: {
        hospital: { select: { name: true } },
        patient: { include: { user: { select: { name: true } } } }
      }
    });

    res.json(booking);
  } catch (error) {
    console.error('Error updating bed booking:', error);
    res.status(500).json({ error: 'Failed to update bed booking' });
  }
};

const getAvailableBeds = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    
    const hospital = await prisma.hospital.findUnique({
      where: { id: hospitalId },
      select: { name: true }
    });

    const activeBeds = await prisma.bedBooking.count({
      where: { 
        hospitalId,
        status: { in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'] }
      }
    });

    // Mock bed availability data
    const totalBeds = 100;
    const availableBeds = totalBeds - activeBeds;

    res.json({
      totalBeds,
      occupiedBeds: activeBeds,
      availableBeds: Math.max(0, availableBeds),
      hospitalName: hospital?.name || 'Hospital'
    });
  } catch (error) {
    console.error('Error fetching bed availability:', error);
    res.status(500).json({ error: 'Failed to fetch bed availability' });
  }
};

module.exports = { createBedBooking, getBedBookings, updateBedBooking, getAvailableBeds };