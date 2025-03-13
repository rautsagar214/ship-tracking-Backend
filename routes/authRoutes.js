const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Admin login route
router.post('/login', async (req, res) => {
  try {
    const { passkey } = req.body;
    
    // Check if passkey matches
    if (passkey === process.env.ADMIN_PASSKEY) {
      // Generate JWT token
      const token = jwt.sign(
        { id: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid passkey' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify token route
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, decoded });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router; 