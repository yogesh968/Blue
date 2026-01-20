const express = require('express');
const passport = require('../config/passport');
const { googleCallback, completeRegistration } = require('../controllers/googleAuthController');

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { 
  failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_failed` 
}), googleCallback);

router.post('/google/complete', completeRegistration);

module.exports = router;