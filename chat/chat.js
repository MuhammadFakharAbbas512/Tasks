const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('message', (msg) => {
    console.log('Message received:', msg);
    io.emit('message', msg); // Broadcast message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Root route handler
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Serve a simple HTML file
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
