const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createBedBooking = async (req, res) => {
  try {
    let { hospitalId, bedType, admissionDate, patientName, reason } = req.body;
    
    // Validate required fields
    if (!hospitalId || !bedType || !admissionDate) {
      return res.status(400).json({ error: 'Hospital, bed type, and admission date are required' });
    }

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Get or create patient record
    let patient = await prisma.patient.findUnique({ where: { userId: req.user.userId } });
    
    if (!patient) {
      // Create patient record if it doesn't exist
      patient = await prisma.patient.create({
        data: {
          userId: req.user.userId,
          gender: 'Not specified',
          medicalHistory: {}
        }
      });
    }

    const booking = await prisma.bedBooking.create({
      data: {
        patientId: patient.id,
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

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    let where = {};
    if (role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (patient) {
        where.patientId = patient.id;
      } else {
        return res.json([]);
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

    if (!id) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

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
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Bed booking not found' });
    }
    res.status(500).json({ error: 'Failed to update bed booking' });
  }
};

const getAvailableBeds = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    
    if (!hospitalId) {
      return res.status(400).json({ error: 'Hospital ID is required' });
    }

    const hospital = await prisma.hospital.findUnique({
      where: { id: hospitalId },
      select: { name: true }
    });

    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

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
      hospitalName: hospital.name
    });
  } catch (error) {
    console.error('Error fetching bed availability:', error);
    res.status(500).json({ error: 'Failed to fetch bed availability' });
  }
};

module.exports = { createBedBooking, getBedBookings, updateBedBooking, getAvailableBeds };