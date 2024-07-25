// Basic middleware function

const express = require('express');
const app = express();
const port = 3000;


app.use(express.static('public'));


const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Pass control to the next middleware
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};

// Global middleware
app.use(logger);

// Route-specific middleware (not needed in this simple example)

// Routes
app.get('/', (req, res) => {
  // Added links to navigate to other pages
  res.send(`
    <h1>Hello World!</h1>
    <a href="/about">About Page</a><br>
    <a href="/contact">Contact Page</a><br>
    <a href="/news">News Page</a><br>
    <a href="/hr">HR Page</a><br>
    <a href="/it">IT Page</a>
  `);
});

app.get('/about', (req, res) => {
  res.send('<h1>About Page</h1>');
});
/*
app.get('/contact', (req, res) => {
  res.send('<h1>Contact Page</h1>');
});
*/
app.get('/contact', (req, res) => {
  res.sendFile(__dirname + '/public/contact.html');
});


app.get('/news', (req, res) => {
  res.send('<h1>News Page</h1>');
});

app.get('/hr', (req, res) => {
  res.send('<h1>HR Page</h1>');
});

app.get('/it', (req, res) => {
  res.send('<h1>IT Page</h1>');
});

// Error-handling middleware (must be the last middleware)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
