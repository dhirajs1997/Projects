var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false});

var WebTorrent = require('webtorrent');
var client = new WebTorrent();

var iosocket = require('../app.js');

module.exports = function(app){

  app.get('/', function(req, res){
    res.render('index');
  });
  app.get('/torrents', function(req, res){
    // console.log(client.torrents);
    if(!client.torrents.length){
      var message = 'noTorrentPresent';
      console.log(message);
      res.render('torrents',{data: message});
    }else{
      res.render('torrents',{data: client.torrents});
    }
  });

  app.post('/torrent', urlencodedParser, function(req, res){

    magnetURI = req.body.torrentid;
    if(client.get(magnetURI)){
      res.render('alreadypresent');
    }else{
      client = new WebTorrent();
      client.add(magnetURI, {path : 'C:/Users/Dhiraj/Desktop' }, function(torrent) {
        torrent.on('ready', function(){
          console.log('Download starting')
        });
        torrent.on('done', function() {
          console.log('Done downloading');
          clearInterval(interval);
          client.destroy();
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
    }
  });

};
