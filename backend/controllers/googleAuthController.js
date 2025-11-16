const jwt = require('jsonwebtoken');
const { prisma } = require('../db/config');

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const googleCallback = async (req, res) => {
  try {
    const { googleId, email, name } = req.user;
    console.log('Google OAuth callback:', { googleId, email, name });
    
    // Check if user exists by email OR googleId
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { googleId: googleId }
        ]
      }
    });
    
    console.log('Found existing user:', user ? 'Yes' : 'No');
    
    if (!user) {
      // New user - redirect to role selection
      console.log('Redirecting to role selection');
      const tempToken = jwt.sign({ googleId, email, name }, process.env.JWT_SECRET, { expiresIn: '10m' });
      return res.redirect(`http://localhost:5173/select-role?token=${tempToken}`);
    }
    
    // Existing user - login directly
    console.log('Existing user login:', user.role);
    const token = generateToken(user.id, user.role);
    res.redirect(`http://localhost:5173/auth-success?token=${token}&user=${encodeURIComponent(JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }))}`);
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.redirect('http://localhost:5173/login?error=auth_failed');
  }
};

const completeRegistration = async (req, res) => {
  try {
    const { token, role } = req.body;
    console.log('Complete registration request:', { role });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { googleId, email, name } = decoded;
    console.log('Decoded token:', { googleId, email, name });
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { googleId: googleId }
        ]
      }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: '', // No password for OAuth users
        role,
        googleId
      }
    });
    
    console.log('Created user:', { id: user.id, role: user.role });
    
    const authToken = generateToken(user.id, user.role);
    
    res.json({
      message: 'Registration completed successfully',
      token: authToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: 'Invalid token or registration failed' });
  }
};

module.exports = { googleCallback, completeRegistration };