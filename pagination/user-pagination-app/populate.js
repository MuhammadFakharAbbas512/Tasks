const mongoose = require('mongoose');
// 
//mongoose.connect('mongodb://localhost:27017/user', { useNewUrlParser: true, useUnifiedTopology: true });
// 
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

const User = mongoose.model('User', userSchema);
/*
const users = [
  { username: 'user1', email: 'user1@example.com', phoneNumber: '03034567890' },
  { username: 'user2', email: 'user2@example.com', phoneNumber: '03134567891' },
  { username: 'user3', email: 'user3@example.com', phoneNumber: '031234567890' },
  { username: 'user4', email: 'user4@example.com', phoneNumber: '032234567891' },
  { username: 'user5', email: 'user5@example.com', phoneNumber: '033234567890' },
  { username: 'user6', email: 'user6@example.com', phoneNumber: '034234567891' },
  { username: 'user7', email: 'user7@example.com', phoneNumber: '033334567890' },
  { username: 'user8', email: 'user8@example.com', phoneNumber: '033434567891' },
  { username: 'user9', email: 'user9@example.com', phoneNumber: '033534567890' },
  { username: 'user10', email: 'user10@example.com', phoneNumber: '033634567891' }
 
];

User.insertMany(users)
  .then(() => {
    console.log('Data inserted');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error inserting data:', err);
  });*/
