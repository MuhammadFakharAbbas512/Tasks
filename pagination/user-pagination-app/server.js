const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/user'); 
const userRoutes = require('./routes/users');


const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
/*
// MongoDB connection -- updated in models/user.js
mongoose.connect('mongodb://localhost:27017/Auth', {}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  phoneNumber: { type: String, unique: true },
});

const User = mongoose.model('User', userSchema);*/

//  Search/ Sort API
app.use('/', userRoutes);

app.get('/api/users/sort', async (req, res) => {
  const { page = 1, limit = 7, search = '', sortBy = 'username', sortOrder = 'asc'  } = req.query;
 /* const searchQuery = search ? {
    $or: [
      { username: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
      { phoneNumber: new RegExp(search, 'i') },
    ],
  }: {}; */
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  try {
    const users = await User.find({}) // search ? searchQuery : {}
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const count = await User.countDocuments(search ? searchQuery : {});

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  console.log('sorted');
});

app.get('/api/users/search', async (req, res) => {
  console.log('search');
  const { page = 1, limit = 7, search = '' } = req.query;
  const searchQuery = search ? {
    $or: [
      { username: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
      { phoneNumber: new RegExp(search, 'i') },
    ],
  } : {};

  try {
    const users = await User.find(searchQuery)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const count = await User.countDocuments(searchQuery);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  console.log('--Searched--');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
