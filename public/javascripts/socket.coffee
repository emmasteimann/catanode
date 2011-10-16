socket = io.connect('http://localhost/')

jQuery(document).ready ->
  game = 0
  socket.on 'connect', (data) ->
    console.log data
    #game = data.game_id

  socket.on 'test', (data) ->
    console.log data

  $('a.join').click (e) ->
    socket.emit 'join_lobby', { name: $(this).prev().val(), game: 2 }
    return false
