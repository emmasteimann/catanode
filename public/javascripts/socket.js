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
    return $('a.join').click(function(e) {
      return false;
    });
  });
}).call(this);
