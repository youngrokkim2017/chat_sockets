const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser } = require('./utils/users');

const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ADMIN';

// Run when client connects
io.on('connection', socket => {
    // console.log('new web socket connection');

    socket.on('joinRoom', ({ username, room }) => {
        // create a user
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // emits to the single client who connected, the current user
        // socket.emit('message', 'Welcome to the chat');
        socket.emit('message', formatMessage(botName, 'Welcome to the chat'));
    
        // when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`)); // this emits to everyone EXCEPT the person that is connecting
    });

    // listen for chatMessage from client side
    socket.on('chatMessage', (msg) => {
        // console.log(msg); // emit this back to the client
        io.emit('message', formatMessage('USER', msg));
    });
    
    // Runs when client disconnects
    socket.on('disconnect', () => {
        // emit to everyone that the user has left the chat
        io.emit('message', formatMessage(botName, 'A user has left the chat'));
    });
})