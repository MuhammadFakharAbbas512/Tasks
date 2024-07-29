const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('message', (msg) => {
    console.log('Message received:', msg);
    socket.broadcast.emit('message', msg); // Broadcast message to all connected clients except the sender
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Root route handler
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'));
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
