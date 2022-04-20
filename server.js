const express = require('express');
const path = require('path');

const app = express();
// Protocolo HTTP
const server = require('http').createServer(app);
// Protocolo WSS - (WebSocket)
const io  = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
// Views EJS
app.set('views', path.join(__dirname, 'public'));
// Engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Routes
app.use('/', (req, res) => {
  res.render('index.html');
});

let messages = [];

io.on('connection', socket => {
  console.log(`Socket conectado: ${socket.id}`);

  socket.emit('previousMessages', messages);

  socket.on('sendMessage', data => {
    messages.push(data);
    socket.broadcast.emit('receiveMessage', data);
  });
});

server.listen(3000);