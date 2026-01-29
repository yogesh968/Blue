const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get doctor schedule
router.get('/doctors/:doctorId/schedule', authenticateToken, async (req, res) => {
  try {
    const { doctorId } = req.params;

    const schedule = await prisma.doctorSchedule.findUnique({
      where: { doctorId }
    });

    if (schedule) {
      res.json(schedule.schedule);
    } else {
      // Return default schedule if none exists
      res.json({
        monday: { startTime: '09:00', endTime: '17:00', available: true },
        tuesday: { startTime: '09:00', endTime: '17:00', available: true },
        wednesday: { startTime: '09:00', endTime: '17:00', available: true },
        thursday: { startTime: '09:00', endTime: '17:00', available: true },
        friday: { startTime: '09:00', endTime: '17:00', available: true },
        saturday: { startTime: '09:00', endTime: '13:00', available: true },
        sunday: { startTime: '09:00', endTime: '13:00', available: false }
      });
    }
  } catch (error) {
    console.error('Error fetching doctor schedule:', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

// Update doctor schedule
router.put('/doctors/:doctorId/schedule', authenticateToken, async (req, res) => {
  try {
    const { doctorId } = req.params;
    const scheduleData = req.body;

    const schedule = await prisma.doctorSchedule.upsert({
      where: { doctorId },
      update: { schedule: scheduleData },
      create: {
        doctorId,
        schedule: scheduleData
      }
    });

    res.json({ message: 'Schedule updated successfully', schedule: schedule.schedule });
  } catch (error) {
    console.error('Error updating doctor schedule:', error);
    res.status(500).json({ error: 'Failed to update schedule' });
  }
});

module.exports = router;