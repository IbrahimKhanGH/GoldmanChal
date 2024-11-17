const express = require('express');
const router = express.Router();
const { generateImageHash } = require('../utils/imageHash');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const Deposit = require('../models/Deposit');

router.post('/check-duplicate', auth, upload.single('image'), async (req, res) => {
  try {
    console.log('Starting duplicate check...');
    
    if (!req.file) {
      console.log('No file provided');
      return res.status(400).json({ error: 'No image provided' });
    }

    if (!req.user || !req.user.id) {
      console.log('No user ID found:', req.user);
      return res.status(401).json({ error: 'User not authenticated' });
    }

    console.log('Generating hash for image...');
    const imageHash = await generateImageHash(req.file.buffer);
    console.log('Generated hash:', imageHash);

    // Check for existing deposits with this hash
    const existingDeposit = await Deposit.findOne({
      userId: req.user.id,
      imageHash: imageHash
    }).lean();

    console.log('Existing deposit check result:', existingDeposit);

    if (existingDeposit) {
      return res.json({
        isDuplicate: true,
        originalDate: existingDeposit.createdAt,
        amount: existingDeposit.amount
      });
    }

    // If not duplicate, save the image hash
    const newDeposit = new Deposit({
      userId: req.user.id,
      imageHash: imageHash,
      type: req.body.type || 'check',
      amount: 0, // Will be updated later
      status: 'pending'
    });

    console.log('Saving new deposit...');
    await newDeposit.save();
    
    console.log('Successfully saved new deposit');
    res.json({ isDuplicate: false });

  } catch (error) {
    console.error('Duplicate check error:', error);
    // Send more detailed error information
    res.status(500).json({ 
      error: 'Error checking for duplicates',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router; 