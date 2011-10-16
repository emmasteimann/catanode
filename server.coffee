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

# active game handling.
class Games
  constructor: (min, max)->
    @minimum = if typeof min == 'number' then min else 0
    @maximum = if typeof max == 'number' then max else 10000
    @list = {}
    
  create: ->
    game_id = Math.floor Math.random() * @maximum
    @list.game_id = {status: '', players: []}
    #return @create() if @list.game_id?
  
  purge: (game_id) ->

games = new Games 0, 10000
console.log games.create()
# end games handler

app.get '/', (req, res) ->
  res.render 'index'

app.get '/create', (req, res) ->
  game_port = 4444
  socket.rooms[game_port] = {}
  res.redirect '/connect/' + game_port

app.get '/connect', (req, res) ->
  res.render 'index'

app.get '/connect/:game_id', (req, res) ->
  # test players
  players = []
  for i in [1..2]
    if i == 1
      status = 'creator'
    else
      status = 'player'
    players.push({ name: 'foo' + i, ip: '0.0.0.0', icon:'http://placekitten.com/400/300', status: status })
  players.push({ icon:'http://placekitten.com/400/300' })
  players.push({ icon:'http://placekitten.com/400/300' })
  # end test
  res.render 'setup', locals:
                      game_id: req.params.game_id
                      players: players,
                      url: req.headers.host + req.url

socket.sockets.on 'connection', (client) ->
  console.log ' ------ '
  console.log socket.rooms
  console.log ' ------ '
  socket.sockets.emit 'connect', { user: 'joined' }
  #client.sockets.in(2).emit 'test', { foo: 'bar' }
  client.on 'join_lobby', (data) ->
    console.log data
    client.join data.game

port = process.env.PORT || 8080
app.listen port
