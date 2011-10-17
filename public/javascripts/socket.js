(function() {
  var socket;
  socket = io.connect('http://localhost/');
  jQuery(document).ready(function() {
    socket.on('connect', function(data) {
      return socket.emit('join_lobby', {
        url: document.URL
      });
    });
    socket.on('test', function(data) {
      return console.log(data);
    });
    socket.on('join_game', function(data) {
      var icon, name, slot;
      console.log('foo');
      data = {
        slot: 1,
        name: 'Brad',
        icon: 'http://placekitten.com/400/400'
      };
      slot = $($('.player')[data.slot - 1]);
      name = $('<h2>' + data.name + '</h2>');
      icon = $('<img src=' + data.icon + ' />');
      slot.children().remove();
      slot.append(name);
      return slot.append(icon);
    });
    $('a.join').click(function(e) {
      socket.emit('join_game', {
        game: document.URL,
        slot: 1
      });
      e.stopPropagation();
      return e.preventDefault();
    });
    $('#chat a').click(function(e) {
      var message;
      message = $(this).prev().val();
      if (message) {
        socket.emit('game_message', {
          name: 'Name',
          message: message,
          game: document.URL
        });
        $(this).prev().val('');
      }
      e.stopPropagation();
      return e.preventDefault();
    });
    return socket.on('message', function(data) {
      var message;
      if (data.action === 'join') {
        message = data.message;
      } else {
        message = data.name + ': ' + data.message;
      }
      return $('#chat #display').append('<p>' + message + '</p>');
    });
  });
}).call(this);
