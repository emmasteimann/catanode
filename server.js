(function() {
  var app, backbone, express, http, port, redis, socket, stylus, _;
  http = require('http');
  _ = require('underscore');
  backbone = require('backbone');
  redis = require('redis');
  express = require('express');
  app = express.createServer();
  stylus = require('stylus');
  socket = require('socket.io').listen(app);
  app.register('.jade', require('jade'));
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  app.use(stylus.middleware({
    src: './views',
    dest: './public'
  }));
  app.get('/', function(req, res) {
    return res.render('index');
  });
  app.get('/connect/:game_id', function(req, res) {
    var i, players;
    players = [];
    for (i = 1; i <= 4; i++) {
      players.push({
        name: 'foo' + i
      });
    }
    console.log(players);
    return res.render('setup', {
      locals: {
        players: players
      }
    });
  });
  socket.sockets.on('connection', function(client) {
    return console.log('Client connected: ' + client);
  });
  port = process.env.PORT || 8080;
  app.listen(port);
}).call(this);
