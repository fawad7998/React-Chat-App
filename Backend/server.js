// server.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.get('/', (req, res) => {
  res.send('Welcome to the Express API!');
});
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://react-chat-app-zfze.vercel.app/',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());

io.on('connection', (socket) => {
  console.log('User A is Connected');
  console.log('User B is Connected');

  socket.on('message', (msg) => {
    io.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
