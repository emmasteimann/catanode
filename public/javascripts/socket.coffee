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

  $('#chat a').click (e) ->
    message = $(this).prev().val()
    if message
      socket.emit 'game_message', { name: 'Name', message: message, game: document.URL }
      $(this).prev().val('')
    e.stopPropagation()
    e.preventDefault()

  socket.on 'message', (data) ->
    $('#chat #display').append('<p>' + data.name + ': ' + data.message + '</p>')
