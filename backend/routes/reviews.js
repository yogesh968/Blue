const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { prisma } = require('../db/config');
    const { doctorId, rating, reviewText } = req.body;

    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.userId }
    });

    const review = await prisma.review.create({
      data: {
        patientId: patient.id,
        doctorId: doctorId,
        rating: parseInt(rating),
        reviewText
      }
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review' });
  }
});

module.exports = router;