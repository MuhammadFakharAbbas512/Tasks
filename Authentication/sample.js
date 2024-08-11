const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const User = require('./models/userModel'); // Adjust the path as necessary

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Auth', {
  //useNewUrlParser: true,
  //useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

const app = express();
const port = 3000;

// Middleware to parse JSON bodies and enable CORS
app.use(bodyParser.json());
app.use(cors());

// Helper function to hash passwords
const hashPassword = async (password) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

// Function to generate JWT
const generateToken = (user) => {
    console.log('Current User:',user);
    console.log('process.env.JWT_SECRET:', 123456);
  return jwt.sign({ id: user._id, username: user.username }, 123456, { expiresIn: '1h' });
};

// Route to create new users (registration)
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }
    const passwordHash = await hashPassword(password);
    const newUser = new User({ username, password: passwordHash });
    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
});

// Route to login and generate a token
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Hello Debugger')
  try {
    const user = await User.findOne({ username });
   // console.log('user:',user);
    if (user) {
        console.log('User found:', user.username);
        console.log('Entered Password:', password);
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (passwordMatch ) {

         console.log('User authenticated, generating token');
         res.status(201).send('User Login successfully'); /*, token);
         const token = generateToken(user);
         console.log('Generated token :',token);
         console.log('Login successful');
         res.json({ message: 'Authentication successful', token });
         res.status(201).send('User Login successfully', token);*/
       
        } else {
          res.status(401).send('Authentication failed: Invalid password');
        }  
      
    } else {
      res.status(401).send('Authentication failed');
    }
  } catch (error) {
    res.status(500).send('Error during authentication');
  }
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('A token is required for authentication');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    return res.status(401).send('Invalid Token');
  }
  return next();
};

// Protected route
app.get('/protected', verifyToken, (req, res) => {
  res.send(`Hello ${req.user.username}, this is a protected route.`);
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
