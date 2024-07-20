const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../BLL/authBLL');

router.post('/register', async (req, res) => {
  console.log('Register route hit. Request body:', req.body);
  const { Username, Fname, Lname, Address, Password, Email } = req.body;
  
  try {
    const response = await registerUser(Username, Fname, Lname, Address, Password, Email);
    console.log('Registration response:', response);

    if (response.token) {
      res.status(201).json(response);
    } else {
      res.status(400).json({ message: response });
    }
  } catch (error) {
    console.error('Error in register route:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  console.log('Login route hit. Request body:', req.body);
  const { Username, Password } = req.body;
  
  try {
    const response = await loginUser(Username, Password);
    console.log('Login response:', response);

    if (response.token) {
      res.json(response);
    } else {
      res.status(400).json({ message: response });
    }
  } catch (error) {
    console.error('Error in login route:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;