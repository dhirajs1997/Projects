//Make connection

var socket = io.connect('http://localhost:3000');

//DOM elements
var progress = document.getElementById('progress');
var downspeed = document.getElementById('downspeed');
var avgspeed = document.getElementById('avgspeed');
var speedcount = 0;
var averagespeed = 0;
//Listen for stats update
socket.on('stats',function(data){
  progress.innerHTML = '<strong>' + data.progress.toFixed(2) + '</strong>' + '%';
  downspeed.innerHTML = '<strong>' + data.downloadSpeed.toFixed(2) + '</strong>' + ' KBps';
  averagespeed +=  data.downloadSpeed;
  avgspeed.innerHTML = '<strong>' + (averagespeed/++speedcount).toFixed(2) + '</strong>' + ' KBps';
});
