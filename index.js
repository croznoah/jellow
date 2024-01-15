const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const dgram = require("dgram");

const HOST = "192.168.10.1";

const CMDPORT = 8889;
const cmdclient = dgram.createSocket("udp4");
cmdclient.bind(CMDPORT);

app.use(express.static('public'));

// Define a route for the root path
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Define a connection event for Socket.IO
io.on('connection', (socket) => {
  socket.on('read', (msg) => {
    readclient.send(msg, 0, msg.length, CMDPORT, HOST, (err, byte) => {
        if (err) {
            console.log(err);
        } else {
            console.log("send successfully");
        }
    })

    // Broadcast the message to all connected cmdclients
    io.emit('command', msg);
  });

  // Listen for commands
  socket.on('command', (msg) => {
    cmdclient.send(msg, 0, msg.length, CMDPORT, HOST, (err, byte) => {
        if (err) {
            console.log(err);
        } else {
            console.log("send successfully");
        }
    })

    // Broadcast the message to all connected cmdclients
    io.emit('command', msg);
  });

  // Define a disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server on CMDPORT 3000
server.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});