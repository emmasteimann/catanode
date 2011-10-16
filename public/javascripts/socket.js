(function() {
  var socket;
  socket = io.connect('http://localhost/');
  jQuery(document).ready(function() {
    var game;
    game = 0;
    socket.on('connect', function(data) {
      return console.log(data);
    });
    socket.on('test', function(data) {
      return console.log(data);
    });
    return $('a.join').click(function(e) {
      socket.emit('join_lobby', {
        name: $(this).prev().val(),
        game: 2
      });
      return false;
    });
  });
}).call(this);
