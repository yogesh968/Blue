const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Get all locations for a doctor
const getDoctorLocations = async (req, res) => {
  try {
    const { doctorId } = req.params;
    
    const locations = await prisma.doctorLocation.findMany({
      where: {
        doctorId: parseInt(doctorId),
        isActive: true
      },
      include: {
        timings: true,
        appointments: {
          where: {
            appointmentDate: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
          }
        }
      }
    });

    const locationsWithStats = locations.map(location => ({
      ...location,
      patientsToday: location.appointments.length,
      totalPatients: location.appointments.length // This would be calculated differently in real app
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
    const { name, address, city, phone, fees, timings } = req.body;

    const location = await prisma.doctorLocation.create({
      data: {
        doctorId: parseInt(doctorId),
        name,
        address,
        city,
        phone,
        fees: parseInt(fees)
      }
    });

    // Add timings for the location
    if (timings) {
      const timingPromises = Object.entries(timings)
        .filter(([day, timing]) => timing.available)
        .map(([day, timing]) => {
          const dayEnum = day.toUpperCase();
          return prisma.doctorTiming.create({
            data: {
              doctorId: parseInt(doctorId),
              locationId: location.id,
              dayOfWeek: dayEnum,
              startTime: timing.start,
              endTime: timing.end
            }
          });
        });
      
      await Promise.all(timingPromises);
    }

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
    const { name, address, city, phone, fees } = req.body;

    const location = await prisma.doctorLocation.update({
      where: { id: parseInt(locationId) },
      data: {
        name,
        address,
        city,
        phone,
        fees: parseInt(fees)
      }
    });

    res.json(location);
  } catch (error) {
    console.error('Error updating doctor location:', error);
    res.status(500).json({ error: 'Failed to update location' });
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
        location: true
      },
      orderBy: {
        appointmentDate: 'asc'
      }
    });

    const formattedAppointments = appointments.map(apt => ({
      id: apt.id,
      patientName: apt.patient.user.name,
      patientAge: apt.patient.user.age || 'N/A',
      appointmentTime: apt.appointmentDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      date: apt.appointmentDate.toISOString().split('T')[0],
      location: apt.location ? `${apt.location.name}, ${apt.location.city}` : 'Not specified',
      symptoms: apt.reason,
      status: apt.status.toLowerCase(),
      fees: apt.location ? apt.location.fees : 0
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
  getDoctorAppointments
};