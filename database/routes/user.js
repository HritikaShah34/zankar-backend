const express = require('express');
const { authenticateJwt, SECRET } = require("../middleware/auth");
const { User, Service, Admin } = require("../db");
const jwt = require('jsonwebtoken');
const router = express.Router();

  router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      res.status(403).json({ message: 'User already exists' });
    } else {
      const newUser = new User({ username, password});
      await newUser.save();
      const token = jwt.sign({ username, role: 'user' }, SECRET);
      res.json({ message: 'User created successfully', token });
    }
  });
  
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      const token = jwt.sign({ username, role: 'user' }, SECRET); 
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
  });
  
  router.post('/count', async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });

        if (user) {
            res.json({ count: user.count });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching count:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/count', async (req, res) => {
  try {
    const { username, count } = req.body;
    const user = await User.findOne({ username });

    if (user) {
      user.count = count;
      await user.save();

      res.json({ message: 'Count updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating count:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/reset-count', async (req, res) => {
  try {
    await User.updateMany({}, { count: 0 });

    res.json({ message: 'Count of all users reset to 0 successfully' });
  } catch (error) {
    console.error('Error resetting counts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

  module.exports = router