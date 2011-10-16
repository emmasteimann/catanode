socket = io.connect('http://localhost/')

jQuery(document).ready ->
  socket.on 'connect', (data) ->
    socket.emit 'join_lobby', { url: document.URL }
    #game = data.game_id

  socket.on 'test', (data) ->
    console.log data

  $('a.join').click (e) ->
    #socket.emit 'join_lobby', { name: $(this).prev().val(), url: document.URL }
    return false

  # chat

