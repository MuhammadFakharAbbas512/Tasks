// routes/authRoutes.js
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); 
const authenticate = require('../middleware/authenticate'); // Adjust the path to your middleware


const router = express.Router();

// Route to serve the sign-in page
router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'signup.html'));
});

// Route to serve the login page
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

// Route to serve the update profile page
router.get('/update', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'update.html'));
});

// Route to serve the delete user page
router.get('/delete', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'delete.html'));
});

// Route to get users page
router.get('/get', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'get.html'));
});

// Routes to serve the forgot password and reset password pages

router.get('/forgot', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'forgot.html'));
});

router.get('/reset-password/:token', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'reset.html'));
});


// Route to create new users (for demonstration purposes)
router.post('/register', async (req, res) => {
  const { username, password, phoneNumber, email  } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: passwordHash,
      phoneNumber,
      email
      //department,
      // gender
    });
    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error('Error registering user', error);
    res.status(500).send('Error registering user');
  }
});

// Protected Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      const passwordMatch = bcrypt.compare(password, user.password);
      console.log('password match: ',passwordMatch,'\nUser found:', user.username);
      if (bcrypt.compare(password, user.password)) {
       // console.log('howdy');
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'User Login successfully', token: token });
      } else {
        res.status(401).send('Authentication failed: Invalid password');
      }
    } else {
      res.status(401).send('Authentication failed: User not found');
    }
  } catch (error) {
    console.error('Error during authentication', error);
    res.status(500).send('Error during authentication');
  }
});

// Route to get the list of registered users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username phoneNumber email'); // hide password hashes from the response
    res.json(users);
  } catch (error) {
    res.status(500).send('Error fetching users');
  }
});

// Route to update user profile data
router.put('/profile/:username', async (req, res) => {
  const { username } = req.params;
  const { password, phoneNumber, email } = req.body; //department, gender
  // Ensure the authenticated user is updating their own profile
  // if (req.user.username !== username) {
  //   return res.status(401).send('Unauthorized');
  try {
    const updatedProfile = {
   //   'profile.password': password,
      password,
      phoneNumber,
      email
    };
    if (password) {
      updatedProfile.password = await bcrypt.hash(password, 10);
    }
    console.log(`Attempting to update user: ${username} with data:`, updatedProfile);

    const user = await User.findOneAndUpdate({ username }, { $set: updatedProfile }, { new: true });
    if (user) {
      console.log(`User profile updated successfully:`, user);
      console.log(`User profile details:`, updatedProfile);
      // res.json(user.profile);
      //return res.status(201).send('User profile updated successfully');
      return res.status(200).json({ message: 'User profile updated successfully', profile: updatedProfile });

    } else {
      console.log(`User not found: ${username}`);
      return res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error updating user profile', error);
    res.status(500).send('Error updating user profile');
  }
});

// Route to delete a user
router.delete('/user/:username', async (req, res) => {
  const { username } = req.params;
  const { password } = req.body; 
  try {
    const user = await User.findOne({ username });
    if (user) {
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('password match: ',passwordMatch,'\nUser found:', user.username);
    if (!passwordMatch) {
      return res.status(401).send('Authentication failed: Invalid password');
    }
    await User.findOneAndDelete({ username });
    res.status(200).send('User deleted successfully');
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error deleting user', error);
    res.status(500).send('Error deleting user');
  }
});

router.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log('email:', email);

  try {
    const user = await User.findOne({ email });
   // console.log('user:', user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const resetLink = `http://localhost:3000/reset-password/${token}`;

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    console.log('token generate:', token);
    console.log('Token Expires:' , new Date(user.resetPasswordExpires));

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             http://${req.headers.host}/reset-password/${token}\n\n
             Click the following link to reset your password: ${resetLink}
             If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending password reset email', error });
  }
});

router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }
    console.log('new password: ', password);
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error });
  }
});

module.exports = router;