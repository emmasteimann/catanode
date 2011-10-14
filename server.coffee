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
app.use stylus.middleware {
  src: './views',
  dest: './public'
}

app.get '/', (req, res) ->
  res.render 'index'

app.get '/connect/:game_id', (req, res) ->
  players = []
  for i in [1..4]
    players.push({ name: 'foo' + i})
  console.log players
  res.render 'setup', locals:
                        players: players

socket.sockets.on 'connection', (client) ->
  console.log 'Client connected: ' + client

port = process.env.PORT || 8080
app.listen port
