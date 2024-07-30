const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Dummy user data for demonstration (passwords will be hashed)
const users = [
  { username: 'user1', passwordHash: '$2b$10$9t5hE0eFdT1Er8FzP/huPOUPN4U2ph0pbv.t9Bqdo5IhxHSDqwd4i' }, // password: password1
  { username: 'user2', passwordHash: '$2b$10$w.wFG5H4B9b7jvTrHC1KK.ephZR4HGs9oqAFw4ZBl1Inz7hOjI8Nu' }, // password: password2
];

// Helper function to hash passwords
const hashPassword = async (password) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

// Authentication middleware
const authenticate = async (req, res, next) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);

  if (user && await bcrypt.compare(password, user.passwordHash)) {
    next(); // User authenticated, proceed to the next middleware/route handler
  } else {
    res.status(401).send('Authentication failed');
  }
};

// Route to create new users (for demonstration purposes)
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Hash the password before storing
  const passwordHash = await hashPassword(password);
  users.push({ username, passwordHash });

  res.send('User registered successfully');
});

// Protected route
app.post('/login', authenticate, (req, res) => {
  res.send('Authentication successful');
});

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the authentication demo!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
