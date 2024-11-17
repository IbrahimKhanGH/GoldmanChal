const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, address } = req.body;
    
    console.log('Received registration request:', { email, firstName, lastName, phone });

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      address
    });

    console.log('Attempting to save user:', user);

    await user.save(); 
    console.log('User saved successfully');

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes working' });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Temporary route to create a test user
router.post('/create-test-user', async (req, res) => {
  try {
    console.log('Attempting to create test user');
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('User already exists');
      return res.json({ 
        message: 'Test user already exists',
        email: 'test@example.com',
        password: 'testpassword123'
      });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    const user = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: hashedPassword,
      phone: '1234567890',
      accounts: [{
        accountType: 'checking',
        balance: 1000
      }]
    });

    await user.save();
    console.log('Test user created successfully');

    res.json({ 
      message: 'Test user created successfully', 
      email: 'test@example.com',
      password: 'testpassword123'
    });
  } catch (error) {
    console.error('Error creating test user:', error);
    res.status(500).json({ 
      message: 'Error creating test user',
      error: error.message 
    });
  }
});

module.exports = router;