(function() {
  var app, backbone, express, games, games_server, http, port, redis, socket, _;
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
  games_server = require('./lib/games');
  games = new games_server.start(0, 9000);
  app.get('/', function(req, res) {
    return res.render('index');
  });
  app.get('/create', function(req, res) {
    var game_port;
    game_port = games.create();
    if (typeof game_port === 'number') {
      socket.rooms[game_port] = {};
      return res.redirect('/connect/' + game_port);
    } else {
      return res.redirect('/error', {
        locals: {
          reason: game_port
        }
      });
    }
  });
  app.get('/connect', function(req, res) {
    return res.render('index');
  });
  app.get('/connect/:game_id', function(req, res) {
    var item, players;
    players = [];
    for (item = 1; item <= 4; item++) {
      players.push('');
    }
    console.log(players);
    return res.render('setup', {
      locals: {
        game_id: req.params.game_id,
        players: players,
        url: req.headers.host + req.url
      }
    });
  });
  Array.prototype.last = function() {
    return this[this.length - 1];
  };
  String.prototype.port = function() {
    return parseInt(this.split('/').last().split(/[^0-9]/)[0]);
  };
  socket.sockets.on('connection', function(client) {
    console.log(' - Game Rooms - ');
    console.log(socket.rooms);
    console.log(' -------------- ');
    client.on('join_lobby', function(data) {
      client.join(data.url.port());
      return socket.sockets["in"](data.url.port()).emit('message', {
        action: 'join',
        message: 'User has connected to the server.'
      });
    });
    client.on('join_game', function(data) {
      return console.log('foo');
    });
    return client.on('game_message', function(data) {
      if (socket.rooms['/' + data.game.port()].indexOf(client.id) > -1) {
        return socket.sockets["in"](data.game.port()).emit('message', {
          action: 'message',
          name: 'Person',
          message: data.message
        });
      }
    });
  });
  port = process.env.PORT || 8080;
  app.listen(port);
}).call(this);
