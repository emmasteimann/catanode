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
# games = require('./lib/games').start(0, 10000) # change to this

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

app.get '/error', (req, res) ->

app.get '/connect', (req, res) ->
  res.render 'index'

app.get '/connect/:game_id', (req, res) ->
  if !games.list[req.params.game_id]
    games.create(req.params.game_id)

  res.render 'setup', locals:
                        game_id: req.params.game_id,
                        players: games.list[req.params.game_id].players,
                        url: req.headers.host + req.url

Array::last = ->
  return this[this.length-1]

String::port = ->
  return parseInt(this.split('/').last().split(/[^0-9]/)[0])

socket.sockets.on 'connection', (client) ->
  client.on 'join_lobby', (data) -> # any user joins the main lobby
    client.join data.url.port()
    socket.sockets.in(data.url.port()).emit 'message', { action: 'join', message: 'User has connected to the server.'}

  client.on 'join_game', (data) ->
    room = data.game.port()
    slot = if data.slot != -1 then data.slot else 1
    if socket.rooms['/' + room].indexOf(client.id) > -1 # if user is in room
      player = games.add_player room, data.slot, data.name
      if player
        socket.sockets.in(room).emit 'join_game', { action: 'has joined the game.', name: data.name, slot: slot, icon: player.icon }

  client.on 'game_message', (data) ->
    room = data.game.port()
    if socket.rooms['/' + room].indexOf(client.id) > -1 # if user is in room
      socket.sockets.in(room).emit 'message', { action: 'message', name: 'Person', message: data.message }

port = process.env.PORT || 8080
app.listen port
console.log 'Server listening on port: ' + port
