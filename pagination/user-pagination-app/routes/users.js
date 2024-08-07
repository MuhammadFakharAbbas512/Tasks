// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/user'); 


// Pagination and Sorting API
router.get('/api/users', async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'username', sortOrder = 'asc' } = req.query;
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  try {
    const users = await User.find()
      .sort(sortOptions)
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

module.exports = router;