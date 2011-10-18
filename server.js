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
  app.get('/error', function(req, res) {});
  app.get('/connect', function(req, res) {
    return res.render('index');
  });
  app.get('/connect/:game_id', function(req, res) {
    if (!games.list[req.params.game_id]) {
      games.create(req.params.game_id);
    }
    return res.render('setup', {
      locals: {
        game_id: req.params.game_id,
        players: games.list[req.params.game_id].players,
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
    client.on('join_lobby', function(data) {
      client.join(data.url.port());
      return socket.sockets["in"](data.url.port()).emit('message', {
        action: 'join',
        message: 'User has connected to the server.'
      });
    });
    client.on('join_game', function(data) {
      var room, slot;
      room = data.game.port();
      slot = data.slot !== -1 ? data.slot : 1;
      if (socket.rooms['/' + room].indexOf(client.id) > -1) {
        if (games.add_player(room, data.slot, data.name)) {
          return socket.sockets["in"](room).emit('join_game', {
            action: 'message',
            name: data.name,
            message: 'has joined the game.'
          });
        }
      }
    });
    return client.on('game_message', function(data) {
      var room;
      room = data.game.port();
      if (socket.rooms['/' + room].indexOf(client.id) > -1) {
        return socket.sockets["in"](room).emit('message', {
          action: 'message',
          name: 'Person',
          message: data.message
        });
      }
    });
  });
  port = process.env.PORT || 8080;
  app.listen(port);
  console.log('Server listening on port: ' + port);
}).call(this);
