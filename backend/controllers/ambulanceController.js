const { prisma } = require('../db/config');

const createAmbulanceBooking = async (req, res) => {
  try {
    const { pickupLocation, destination, bookingTime, patientId, amount } = req.body;

    // Find available ambulance
    const availableAmbulance = await prisma.ambulance.findFirst({
      where: { available: true },
      include: { hospital: { select: { name: true, city: true } } }
    });

    if (!availableAmbulance) {
      return res.status(400).json({ error: 'No ambulance available at the moment' });
    }

    const booking = await prisma.ambulanceBooking.create({
      data: {
        patientId: patientId,
        ambulanceId: availableAmbulance.id,
        pickupLocation,
        destination,
        bookingTime: new Date(bookingTime),
        amount: parseFloat(amount),
        status: 'PENDING'
      },
      include: {
        ambulance: {
          include: {
            hospital: { select: { name: true, phone: true } }
          }
        },
        patient: { include: { user: { select: { name: true, phone: true } } } }
      }
    });

    // Mark ambulance as unavailable
    await prisma.ambulance.update({
      where: { id: availableAmbulance.id },
      data: { available: false }
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to book ambulance' });
  }
};

const getAmbulanceBookings = async (req, res) => {
  try {
    const { userId, role } = req.user;

    let where = {};
    if (role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      where.patientId = patient?.id;
    }

    const bookings = await prisma.ambulanceBooking.findMany({
      where,
      include: {
        ambulance: {
          include: {
            hospital: { select: { name: true, phone: true } }
          }
        },
        patient: { include: { user: { select: { name: true, phone: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ambulance bookings' });
  }
};

const updateAmbulanceBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await prisma.ambulanceBooking.update({
      where: { id: id },
      data: { status },
      include: {
        ambulance: true
      }
    });

    // If completed or cancelled, make ambulance available again
    if (status === 'COMPLETED' || status === 'CANCELLED') {
      await prisma.ambulance.update({
        where: { id: booking.ambulanceId },
        data: { available: true }
      });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ambulance booking' });
  }
};

const getAvailableAmbulances = async (req, res) => {
  try {
    const ambulances = await prisma.ambulance.findMany({
      where: { available: true },
      include: {
        hospital: { select: { name: true, city: true, phone: true } }
      }
    });

    res.json(ambulances);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch available ambulances' });
  }
};

module.exports = { createAmbulanceBooking, getAmbulanceBookings, updateAmbulanceBooking, getAvailableAmbulances };