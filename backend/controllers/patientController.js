const { prisma } = require('../db/config');

const createPatientProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const { gender, dob, bloodGroup, address, emergencyContact, medicalHistory } = req.body;

    const existingPatient = await prisma.patient.findUnique({ where: { userId } });
    if (existingPatient) {
      return res.status(400).json({ error: 'Patient profile already exists' });
    }

    const patient = await prisma.patient.create({
      data: {
        userId,
        gender,
        dob: dob ? new Date(dob) : null,
        bloodGroup,
        address,
        emergencyContact,
        medicalHistory: medicalHistory || {}
      },
      include: {
        user: { select: { name: true, email: true, phone: true } }
      }
    });

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create patient profile' });
  }
};

const getPatientProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    const patient = await prisma.patient.findUnique({
      where: { userId },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        appointments: {
          include: {
            doctor: { include: { user: { select: { name: true } } } }
          },
          orderBy: { appointmentDate: 'desc' },
          take: 5
        },
        bedBookings: {
          include: {
            hospital: { select: { name: true } }
          },
          orderBy: { createdAt: 'desc' },
          take: 3
        }
      }
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient profile not found' });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patient profile' });
  }
};

const updatePatientProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const { gender, dob, bloodGroup, address, emergencyContact, medicalHistory } = req.body;

    const updateData = {};
    if (gender) updateData.gender = gender;
    if (dob) updateData.dob = new Date(dob);
    if (bloodGroup) updateData.bloodGroup = bloodGroup;
    if (address) updateData.address = address;
    if (emergencyContact) updateData.emergencyContact = emergencyContact;
    if (medicalHistory) updateData.medicalHistory = medicalHistory;

    const patient = await prisma.patient.update({
      where: { userId },
      data: updateData,
      include: {
        user: { select: { name: true, email: true, phone: true } }
      }
    });

    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update patient profile' });
  }
};

const addMedicalRecord = async (req, res) => {
  try {
    const { userId } = req.user;
    const { recordType, description, date, doctorName, hospitalName } = req.body;

    const patient = await prisma.patient.findUnique({ where: { userId } });
    if (!patient) {
      return res.status(404).json({ error: 'Patient profile not found' });
    }

    const currentHistory = patient.medicalHistory || {};
    const records = currentHistory.records || [];
    
    const newRecord = {
      id: Date.now(),
      recordType,
      description,
      date: date || new Date().toISOString(),
      doctorName,
      hospitalName,
      createdAt: new Date().toISOString()
    };

    records.push(newRecord);

    await prisma.patient.update({
      where: { userId },
      data: {
        medicalHistory: {
          ...currentHistory,
          records
        }
      }
    });

    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add medical record' });
  }
};

module.exports = { createPatientProfile, getPatientProfile, updatePatientProfile, addMedicalRecord };