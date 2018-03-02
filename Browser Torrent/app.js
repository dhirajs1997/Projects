var express = require('express');
// var bodyParser = require('body-parser');
var torrentcontroller = require('./controllers/torrentcontroller');
// var WebTorrent = require('webtorrent');

var app = express();

var socket = require('socket.io');

app.set('view engine', 'ejs');

//static files
app.use(express.static('./'));

//fire controllers
torrentcontroller(app, io);

//listen to port
var server = app.listen(3000, function(){
  console.log('PORT 3000 ACTIVATED');
});

var io = socket(server);

io.on('connection', function(){
  console.log('socket connected');
});

module.exports.io = io;
