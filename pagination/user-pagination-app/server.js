const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const populate = require('./populate'); // Adjust the path as necessary

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
  email: String,
  phoneNumber: String,
});

const User = mongoose.models.User // mongoose.model('User', userSchema);

// Populate the database with users
const users = [
    { username: 'Imran', email: 'Imran1@gmail.com', phoneNumber: '03034567890' },
    { username: 'Ali', email: 'ali110@gmail.com', phoneNumber: '03134567891' },
    { username: 'Bilal', email: 'bilal5@gmail.com', phoneNumber: '031234567890' },
    { username: 'Meesum', email: 'meesum@gmail.com', phoneNumber: '032234567891' },
    { username: 'Qumber', email: 'qumber5@gmail.com', phoneNumber: '033234567890' },
    { username: 'Zohair', email: 'zohair@gmail.com', phoneNumber: '034234567891' },
    { username: 'Qasim', email: 'qasim07@gmail.com', phoneNumber: '033334567890' },
    { username: 'Zain', email: 'zain18@gmail.com', phoneNumber: '033434567891' },
    { username: 'Huzaifa', email: 'huzz8@gmail.com', phoneNumber: '033534567890' },
    { username: 'Malik', email: 'mmalik10@gmail.com', phoneNumber: '033634567891' }
   
  ];
async function insertUsers(users) {
    for (const user of users) {
      try {
        await User.updateOne(
          { username: user.username },
          { $setOnInsert: user },
          { upsert: true }
        );
      } catch (err) {
        console.error('Error inserting data:', err);
      }
    }
    console.log('User Data inserted');
//    mongoose.connection.close();
  }
  
  insertUsers(users);


// Pagination API
app.get('/api/users', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const users = await User.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await User.countDocuments();

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
