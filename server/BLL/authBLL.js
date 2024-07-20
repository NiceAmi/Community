const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserByUsername, createUser } = require('../Models/authModel');
require('dotenv').config();

const registerUser = async (Username, Fname, Lname, Address, Password, Email) => {
  try {
    console.log('Attempting to register user:', Username);

    const existingUser = await getUserByUsername(Username);
    if (existingUser) {
      console.log('User already exists:', Username);
      return 'User already exists';
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    const newUser = await createUser({ Username, Fname, Lname, Address, PasswordHash: hashedPassword, Email });

    if (!newUser) {
      console.log('Failed to create user in database');
      return 'Failed to create user';
    }

    console.log('User created successfully:', Username);

    const payload = { userId: newUser.UserID };
    const token = jwt.sign(payload, process.env.SECRET_TOKEN_KEY, { expiresIn: '3h' });

    return { token, Username: newUser.Username, userId: newUser.UserID };
  } catch (error) {
    console.error('Error registering user:', error);
    return `Error registering user: ${error.message}`;
  }
};

const loginUser = async (Username, Password) => {
  try {
    console.log('Attempting login for username:', Username);

    const user = await getUserByUsername(Username);
    if (!user) {
      console.log('User not found in database:', Username);
      return 'Invalid credentials';
    }

    console.log('User found, comparing passwords');

    const isMatch = await bcrypt.compare(Password, user.PasswordHash);
    if (!isMatch) {
      console.log('Password does not match for user:', Username);
      return 'Invalid credentials';
    }

    console.log('Password matched, generating token for user:', Username);

    const payload = { userId: user.UserID };
    const token = jwt.sign(payload, process.env.SECRET_TOKEN_KEY, { expiresIn: '3h' });

    console.log('Login successful for user:', Username);
    return {
      token,
      userId: user.UserID,
      Username: user.Username,
      Fname: user.Fname,
      Lname: user.Lname,
      Address: user.Address,
      Email: user.Email,
      ProfileImageURL: user.ProfileImageURL
    };
  } catch (error) {
    console.error('Error logging in user:', error);
    return `Error logging in user: ${error.message}`;
  }
};

module.exports = {
  registerUser,
  loginUser
};