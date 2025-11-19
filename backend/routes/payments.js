const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { prisma } = require('../db/config');
    const { appointmentId, amount, paymentMethod } = req.body;

    const payment = await prisma.payment.create({
      data: {
        appointmentId: parseInt(appointmentId),
        amount: parseFloat(amount),
        paymentMethod,
        paymentStatus: 'PAID',
        transactionId: `TXN_${Date.now()}`
      }
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Payment failed' });
  }
});

module.exports = router;