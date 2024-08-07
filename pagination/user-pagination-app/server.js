const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
// const User = require('./models/user'); 
const userRoutes = require('./routes/users');


const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection
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

const User = mongoose.model('User', userSchema);

// Pagination and Search/ Sort API
app.use('/', userRoutes);

app.get('/api/users', async (req, res) => {
  const { page = 1, limit = 7, search = '' } = req.query;
  const searchQuery = {
    $or: [
      { username: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
      { phoneNumber: new RegExp(search, 'i') },
    ],
  };

  try {
    const users = await User.find(search ? searchQuery : {})
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
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
