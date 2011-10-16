class Games
  constructor: (min, max)->
    @minimum = if typeof min == 'number' then min else 0
    @maximum = if typeof max == 'number' then max else 10000
    @list = {}
    @new_allowed = true # whether or not games should be allowed
    
  create: (callback) ->
    return 'No new games may be created' if @new_allowed == false # fallback if too many games exist
    game_id = @req_unused_game()
    @list[game_id] = { status: 'lobby', players: [] }
    game_id
  
  req_unused_game: ->
    game_id = Math.floor Math.random() * @maximum
    @new_allowed = false if Object.keys(@list).length == @maximum - (@maximum / 20) # leeway to not bog the server down (5%)
    return @req_unused_game() if @list[game_id]? # re-run method if game is active
    game_id
    
  purge: (game_id) ->

exports.games = Games()
