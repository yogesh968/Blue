const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all locations for a doctor
const getDoctorLocations = async (req, res) => {
  try {
    const { doctorId } = req.params;
    
    const locations = await prisma.doctorLocation.findMany({
      where: {
        doctorId: parseInt(doctorId),
        isActive: true
      }
    });

    const locationsWithStats = locations.map(location => ({
      ...location,
      patientsToday: 0,
      totalPatients: location.totalPatients || 0
    }));

    res.json(locationsWithStats);
  } catch (error) {
    console.error('Error fetching doctor locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};

// Add new location for doctor
const addDoctorLocation = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { name, address, city, phone } = req.body;

    const location = await prisma.doctorLocation.create({
      data: {
        doctorId: parseInt(doctorId),
        name,
        address,
        city,
        phone
      }
    });

    res.status(201).json(location);
  } catch (error) {
    console.error('Error adding doctor location:', error);
    res.status(500).json({ error: 'Failed to add location' });
  }
};

// Update doctor location
const updateDoctorLocation = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { name, address, city, phone } = req.body;

    const location = await prisma.doctorLocation.update({
      where: { id: parseInt(locationId) },
      data: {
        name,
        address,
        city,
        phone
      }
    });

    res.json(location);
  } catch (error) {
    console.error('Error updating doctor location:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
};

// Increment patient count for location
const incrementLocationPatientCount = async (req, res) => {
  try {
    const { locationId } = req.params;

    const location = await prisma.doctorLocation.update({
      where: { id: parseInt(locationId) },
      data: {
        totalPatients: { increment: 1 }
      }
    });

    res.json(location);
  } catch (error) {
    console.error('Error incrementing patient count:', error);
    res.status(500).json({ error: 'Failed to increment patient count' });
  }
};

// Delete doctor location
const deleteDoctorLocation = async (req, res) => {
  try {
    const { locationId } = req.params;

    await prisma.doctorLocation.update({
      where: { id: parseInt(locationId) },
      data: { isActive: false }
    });

    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor location:', error);
    res.status(500).json({ error: 'Failed to delete location' });
  }
};

// Get doctor appointments with location details
const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    const startDate = date ? new Date(date) : new Date();
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: parseInt(doctorId),
        appointmentDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        patient: {
          include: {
            user: true
          }
        },
        doctor: {
          include: {
            hospital: true
          }
        }
      },
      orderBy: {
        appointmentDate: 'asc'
      }
    });

    const formattedAppointments = appointments.map(apt => ({
      id: apt.id,
      patientName: apt.patient.user.name,
      patientAge: 'N/A',
      appointmentTime: apt.appointmentDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      date: apt.appointmentDate.toISOString().split('T')[0],
      location: apt.doctor.hospital ? `${apt.doctor.hospital.name}, ${apt.doctor.hospital.city}` : 'Not specified',
      symptoms: apt.reason,
      status: apt.status.toLowerCase(),
      fees: apt.doctor.fees
    }));

    res.json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

module.exports = {
  getDoctorLocations,
  addDoctorLocation,
  updateDoctorLocation,
  deleteDoctorLocation,
  getDoctorAppointments,
  incrementLocationPatientCount
};