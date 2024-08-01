const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/userModel'); // Adjust the path as necessary
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Auth', {}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});


// Helper function to hash passwords
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};
// Function to generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Authentication middleware for testing purposes
const authenticate = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user) {
      console.log('User found:', user);
      const isValid = await user.isValidPassword(password);
      console.log('Password is valid:', isValid);
      console.log('User:', user);
      console.log('Password:', password);
      if (isValid) {
        console.log('User authenticated');
        next(); // User authenticated, proceed to the next middleware/route handler
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
};

// Route to create new users (for demonstration purposes)
// Route to create new users (for demonstration purposes)
app.post('/register', async (req, res) => {
  const { username, password, phoneNumber, email, department, gender } = req.body;
  try {
    const passwordHash = await hashPassword(password);
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


// Protected  Login route
app.post('/login', async (req, res) => {
  //res.send('Authentication successful');
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      //console.log('User found:', user);
    //  const isValid = await user.isValidPassword(password);
    //  console.log('Password is valid:', isValid);
      console.log('Saved User:', user.username);
      console.log('Saved Password:', user.password);
      console.log('Entered Password:', password);
      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', passwordMatch);
      if (bcrypt.compare(password, user.password)) {
        console.log('User authenticated');
        res.status(201).send('User Login successfully');
      // next(); // User authenticated, proceed to the next middleware/route handler
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
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username'); // Exclude password hashes from the response
    res.json(users);
  } catch (error) {
    res.status(500).send('Error fetching users');
  }
});


// Route to update user profile data
app.put('/profile/:username', async (req, res) => {
  const { username } = req.params;
  const { password,phoneNumber, email, department, gender } = req.body;
  try {
    const updatedProfile = {
      'profile.password': password,
      'profile.phoneNumber': phoneNumber,
      'profile.email': email,
      
    };
    const user = await User.findOneAndUpdate({ username }, { $set: updatedProfile }, { new: true });
    if (user) {
      res.json(user.profile);
      res.status(201).send('User profile updated successfully');
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error updating user profile', error);
    res.status(500).send('Error updating user profile');
  }
});

// Route to delete a user
app.delete('/user/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOneAndDelete({ username });
    if (user) {
      res.status(200).send('User deleted successfully');
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error deleting user', error);
    res.status(500).send('Error deleting user');
  }
});

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the authentication demo!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
