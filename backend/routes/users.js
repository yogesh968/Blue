const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const { prisma } = require('../db/config');
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true, phone: true, role: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;