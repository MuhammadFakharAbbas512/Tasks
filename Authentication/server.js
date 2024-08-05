// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const authRoutes = require('./routes/authRoutes'); // Import the routes

const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Auth', {}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Use the routes
app.use('/', authRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the authentication demo!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/login`);
});