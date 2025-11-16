// Input validation middleware
const validateRegistration = (req, res, next) => {
  const { name, email, password, role } = req.body;
  
  if (!name || !email || !password || !role) {
    return res.status(400).json({ 
      error: 'Missing required fields: name, email, password, role' 
    });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ 
      error: 'Password must be at least 6 characters long' 
    });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Invalid email format' 
    });
  }
  
  const validRoles = ['PATIENT', 'DOCTOR', 'HOSPITAL'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ 
      error: 'Invalid role. Must be PATIENT, DOCTOR, or HOSPITAL' 
    });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email and password are required' 
    });
  }
  
  next();
};

module.exports = {
  validateRegistration,
  validateLogin
};