const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { prisma } = require('../db/config');
    const { userId, role } = req.user;

    let where = {};
    if (role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (!patient) return res.json([]);
      where = {
        appointment: {
          patientId: patient.id
        }
      };
    } else if (role === 'DOCTOR') {
      const doctor = await prisma.doctor.findUnique({ where: { userId } });
      if (!doctor) return res.json([]);
      where = {
        appointment: {
          doctorId: doctor.id
        }
      };
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        appointment: {
          include: {
            doctor: { include: { user: { select: { name: true } } } },
            patient: { include: { user: { select: { name: true } } } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Format for frontend
    const formattedPayments = payments.map(p => ({
      id: p.id,
      description: `Consultation with Dr. ${p.appointment.doctor.user.name}`,
      amount: p.amount,
      date: p.createdAt.toISOString().split('T')[0],
      status: p.paymentStatus,
      method: p.paymentMethod,
      transactionId: p.transactionId
    }));

    res.json(formattedPayments);
  } catch (error) {
    console.error('Fetch payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { prisma } = require('../db/config');
    const { appointmentId, amount, paymentMethod } = req.body;

    const payment = await prisma.payment.create({
      data: {
        appointmentId,
        amount: parseFloat(amount),
        paymentMethod,
        paymentStatus: 'PAID',
        transactionId: req.body.transactionId || `TXN_${Date.now()}`
      }
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Payment failed', details: error.message });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { prisma } = require('../db/config');
    const { id } = req.params;
    const { status } = req.body;

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        paymentStatus: status,
        transactionId: status === 'PAID' ? `TXN_${Date.now()}` : undefined
      }
    });

    res.json(payment);
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

module.exports = router;