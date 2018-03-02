var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false});

var WebTorrent = require('webtorrent');
var client = new WebTorrent();

var iosocket = require('../app.js');

module.exports = function(app){

  app.get('/', function(req, res){
    res.render('index');
  });

  app.post('/torrent', urlencodedParser, function(req, res){

    magnetURI = req.body.torrentid;
    client.add(magnetURI, {path : 'C:/Users/ADMIN/Desktop/webtorrent/download' }, function(torrent) {
      torrent.on('ready', function(){
        console.log('Download starting')
      });
      torrent.on('done', function() {
        console.log('Done downloading');
        clearInterval(interval);
        data = {progress: torrent.progress * 100, downloadSpeed: torrent.downloadSpeed / 1024};
        iosocket.io.sockets.emit('stats',data);
      })
      res.render('downloading', {data: torrent});
      var interval = setInterval(function () {
        data = {progress: torrent.progress * 100, downloadSpeed: torrent.downloadSpeed / 1024};
        iosocket.io.sockets.emit('stats',data);
        console.log('Progress: ' + (torrent.progress * 100).toFixed(1) + '%');
        console.log('Download speed:' + torrent.downloadSpeed / 1024 + 'KBps \n');
      }, 2000);
    });
  });

};
