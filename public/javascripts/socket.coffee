socket = io.connect('http://localhost/')

jQuery(document).ready ->
  socket.on 'connect', (data) ->
    socket.emit 'join_lobby', { url: document.URL }
    #game = data.game_id

  socket.on 'test', (data) ->
    console.log data

  socket.on 'join_game', (data) ->
    console.log 'foo'
    data = { slot: 1, name: 'Brad', icon: 'http://placekitten.com/400/400' }
    slot = $($('.player')[data.slot-1])
    name = $('<h2>' + data.name + '</h2>')
    icon = $('<img src=' + data.icon + ' />')

    slot.children().remove()
    slot.append(name)
    slot.append(icon)

  $('a.join').click (e) ->
    socket.emit 'join_game', { game: document.URL, slot: 1 }
    #socket.emit 'join_lobby', { name: $(this).prev().val(), url: document.URL }

    e.stopPropagation()
    e.preventDefault()

  # chat
  $('#chat a').click (e) ->
    message = $(this).prev().val()
    if message
      socket.emit 'game_message', { name: 'Name', message: message, game: document.URL }
      $(this).prev().val('')

    e.stopPropagation()
    e.preventDefault()

  socket.on 'message', (data) ->
    if data.action == 'join'
      message = data.message
    else
      message = data.name + ': ' + data.message
      
    $('#chat #display').append('<p>' + message + '</p>')
