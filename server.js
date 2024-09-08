const express = require('express');
const http = require('http');
const socketIo = require('socket.io')
const cors = require('cors')
const mongoose = require('mongoose');
// const dataRouter = require('./Routes/Data.route');
// const userRouter = require('./Routes/User.route');
const linkRoutes = require('./RoutesFolder/link.route');
const userRoutes = require('./RoutesFolder/user.route');
const dotenv = require('dotenv');
const connectToDB = require('./Controllers/dbConnection');

const app = express();

dotenv.config()

app.use(cors())
app.use(express.json())

// app.use('/data', dataRouter)
app.use('/link', linkRoutes)
app.use('/user', userRoutes)

const server = http.createServer(app);

// Initialize socket.io with the server
const io = socketIo(server, {
  cors: {
    origin: '*',
    method: ['GET', 'POST'],
    credential: true
  }
});

// Serve static files from the 'public' directory
// app.use(express.static('public'));


io.on('connection', (socket) => {

  console.log('An user connected id', socket.id)

  socket.emit('test', `Welcome from server! ${socket.id}`)
  io.emit('test', `A new user connected ${socket.id}`)

  socket.on('dataAdded', (data) => {
    console.log('data added successfully!', data)
    io.emit('receiveData', data)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


// Start the server
const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
  connectToDB()
  console.log(`Server is running on port ${PORT}`);
});