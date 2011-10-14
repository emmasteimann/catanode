http = require 'http'

_ = require 'underscore'
backbone = require 'backbone'

redis = require('redis')#.createClient()

express = require 'express'
app = express.createServer()
stylus = require 'stylus'
socket = require('socket.io').listen(app)

app.register '.jade', require 'jade'
app.set 'view engine', 'jade'
app.set 'view options', {
  layout: false
}
app.use express.static(__dirname + "/public/")

app.get '/', (req, res) ->
  res.render 'index'

app.get '/connect/:game_id', (req, res) ->
  players = []
  for i in [1..2]
    if i == 1
      status = 'creator'
    else
      status = 'player'

    players.push({ name: 'foo' + i, ip: '0.0.0.0', icon:'http://placekitten.com/400/300', status: status })
  players.push({ icon:'http://placekitten.com/400/300' })
  players.push({ icon:'http://placekitten.com/400/300' })
  res.render 'setup', locals:
                        game_id: req.params.game_id
                        players: players,
                        url: req.headers.host + req.url

socket.sockets.on 'connection', (client) ->
  socket.emit 'join', { hello: 'world' }
  console.log '----'
  console.log 'Client connected'
  console.log '----'

port = process.env.PORT || 8080
app.listen port
