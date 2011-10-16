(function() {
  var Games, app, backbone, express, games, http, port, redis, socket, _;
  http = require('http');
  _ = require('underscore');
  backbone = require('backbone');
  redis = require('redis');
  express = require('express');
  app = express.createServer();
  socket = require('socket.io').listen(app);
  app.register('.jade', require('jade'));
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  app.use(express.static(__dirname + "/public/"));
  Games = (function() {
    function Games(min, max) {
      var _base, _base2;
      console.log(typeof min, min, typeof min === 'number');
      this.minimum = typeof (_base = typeof min === 'number') === "function" ? _base(min || 0) : void 0;
      this.maximum = typeof (_base2 = typeof max === 'number') === "function" ? _base2(max || 10000) : void 0;
      this.list = [];
      console.log(this.minimum);
    }
    Games.prototype.create = function() {};
    return Games;
  })();
  games = new Games(0, 1000);
  console.log(games);
  app.get('/', function(req, res) {
    return res.render('index');
  });
  app.get('/create', function(req, res) {
    var game_port;
    game_port = 4444;
    socket.rooms[game_port] = {};
    return res.redirect('/connect/' + game_port);
  });
  app.get('/connect', function(req, res) {
    return res.render('index');
  });
  app.get('/connect/:game_id', function(req, res) {
    var i, players, status;
    players = [];
    for (i = 1; i <= 2; i++) {
      if (i === 1) {
        status = 'creator';
      } else {
        status = 'player';
      }
      players.push({
        name: 'foo' + i,
        ip: '0.0.0.0',
        icon: 'http://placekitten.com/400/300',
        status: status
      });
    }
    players.push({
      icon: 'http://placekitten.com/400/300'
    });
    players.push({
      icon: 'http://placekitten.com/400/300'
    });
    return res.render('setup', {
      locals: {
        game_id: req.params.game_id,
        players: players,
        url: req.headers.host + req.url
      }
    });
  });
  socket.sockets.on('connection', function(client) {
    console.log(' ------ ');
    console.log(socket.rooms);
    console.log(' ------ ');
    socket.sockets.emit('connect', {
      user: 'joined'
    });
    return client.on('join_lobby', function(data) {
      console.log(data);
      return client.join(data.game);
    });
  });
  port = process.env.PORT || 8080;
  app.listen(port);
}).call(this);
