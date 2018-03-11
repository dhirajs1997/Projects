//Make connection

var socket = io.connect('http://localhost:3000');

//DOM elements
var progress = document.getElementById('progress');
var downspeed = document.getElementById('downspeed');

//Listen for stats update
socket.on('stats',function(data){
  if(data.progress == 100){
    document.getElementById('status').innerHTML = 'Download Finished!'
  }
  progress.innerHTML = '<strong>' + data.progress + '</strong>' + '%';
  downspeed.innerHTML = '<strong>' + data.downloadSpeed + '</strong>' + ' KBps';
});
