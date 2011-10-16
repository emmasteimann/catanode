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
      this.minimum = typeof min === 'number' ? min : 0;
      this.maximum = typeof max === 'number' ? max : 10000;
      this.list = {};
      this.new_allowed = true;
    }
    Games.prototype.create = function(callback) {
      var game_id;
      if (this.new_allowed === false) {
        return 'No new games may be created';
      }
      game_id = this.req_unused_game();
      this.list[game_id] = {
        status: 'lobby',
        players: []
      };
      return game_id;
    };
    Games.prototype.req_unused_game = function() {
      var game_id;
      game_id = Math.floor(Math.random() * this.maximum);
      if (Object.keys(this.list).length === this.maximum - (this.maximum / 20)) {
        this.new_allowed = false;
      }
      if (this.list[game_id] != null) {
        return this.req_unused_game();
      }
      return game_id;
    };
    Games.prototype.purge = function(game_id) {};
    return Games;
  })();
  games = new Games(0, 10000);
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
