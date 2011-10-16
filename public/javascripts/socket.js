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
    $('a.join').click(function(e) {
      return false;
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
      return $('#chat #display').append('<p>' + data.name + ': ' + data.message + '</p>');
    });
  });
}).call(this);
