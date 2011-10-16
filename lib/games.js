var Games;
Games = (function() {
  function Games(min, max) {
    this.minimum = typeof min === 'number' ? min : 0;
    this.maximum = typeof max === 'number' ? max : 10000;
    this.list = {};
    this.new_allowed = true;
  }
  Games.prototype.create = function(callback) {
    var game_id;
    if (this.new_allowed === false) {
      return 'No new games may be created';
    }
    game_id = this.req_unused_game();
    this.list[game_id] = {
      status: 'lobby',
      players: []
    };
    return game_id;
  };
  Games.prototype.req_unused_game = function() {
    var game_id;
    game_id = Math.floor(Math.random() * this.maximum);
    if (Object.keys(this.list).length === this.maximum - (this.maximum / 20)) {
      this.new_allowed = false;
    }
    if (this.list[game_id] != null) {
      return this.req_unused_game();
    }
    return game_id;
  };
  Games.prototype.purge = function(game_id) {};
  return Games;
})();

exports.create = Games;
