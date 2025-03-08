const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Get user preferences
router.get('/', auth, async (req, res) => {
  try {
    const user = req.user;
    res.json(user.preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user preferences
router.put('/', auth, async (req, res) => {
  try {
    const { topics, sources, keywords } = req.body;
    
    // Update user preferences
    const user = req.user;
    user.preferences = {
      topics: topics || [],
      sources: sources || [],
      keywords: keywords || []
    };
    
    await user.save();
    
    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
