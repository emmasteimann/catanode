http = require 'http'
_ = require 'underscore'
backbone = require 'backbone'

redis = require('redis')#.createClient()

express = require 'express'
app = express.createServer()
socket = require('socket.io').listen(app)

app.register '.jade', require 'jade'
app.set 'view engine', 'jade'
app.set 'view options', {
  layout: false
}
app.use express.static(__dirname + "/public/")

games_server = require('./lib/games')
games = new games_server.start(0, 9000)

app.get '/', (req, res) ->
  res.render 'index'

app.get '/create', (req, res) ->
  game_port = games.create()
  if typeof game_port == 'number'
    socket.rooms[game_port] = {}
    res.redirect '/connect/' + game_port
  else
    res.redirect '/error', locals:
                           reason: game_port

app.get '/connect', (req, res) ->
  res.render 'index'

app.get '/connect/:game_id', (req, res) ->
  # test players
  players = []
  for item in [1..4]
    players.push ''
  console.log players
  # end test
  res.render 'setup', locals:
                      game_id: req.params.game_id
                      players: players,
                      url: req.headers.host + req.url

Array::last = ->
  return this[this.length-1]

String::port = ->
  return parseInt(this.split('/').last().split(/[^0-9]/)[0])

# games needs: join_lobby, join_game, leave_game, (?) start_game
socket.sockets.on 'connection', (client) ->
  console.log ' - Game Rooms - '
  console.log socket.rooms
  console.log ' -------------- '
  #socket.sockets.emit 'connect', { user: 'joined' }
  #client.sockets.in(2).emit 'test', { foo: 'bar' }
  client.on 'join_lobby', (data) -> # any user joins the main lobby
    console.log client.id
    client.join data.url.port()
  client.on 'join_game', (data) ->
    console.log 'foo'
  client.on 'game_message', (data) ->
    if socket.rooms['/' + data.game.port()].indexOf(client.id) > -1 # if user is in room
      client.to('/' + data.game.port()).emit 'message', { name: 'Someone', message: data.message }
      #socket.sockets.in('/' + data.game.port()).emit 'message', { name: 'message', message: 'hi' }
      #socket.sockets.in('/' + data.game.port()).emit 'message', { name: 'Person', message: data.message } # works, only sends to one.
      #client.broadcast.to('/' + data.game.port()).emit 'message', { name: 'Person', message: data.message }

port = process.env.PORT || 8080
app.listen port
