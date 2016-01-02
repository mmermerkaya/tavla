isCollectable = function(gameId, from) {
    var game = Games.findOne({
        _id: gameId
    });
    var currentPlayer = game.turn % 2;
    if (game.board[from].color !== currentPlayer) {
        return false;
    }

    var cellCheck = function(cell) {
        return cell.color !== currentPlayer;
    };

    var a = currentPlayer === 0 ? from + 1 : 18;
    var b = currentPlayer === 0 ? 6 : from;
    var die = currentPlayer === 0 ? from + 1 : 24 - from;

    // The player can pick pieces
    var allowPick = _.every(game.board.slice(((currentPlayer + 1) % 2) * 6, 18 + ((currentPlayer + 1) % 2) * 6), cellCheck);

    // This piece is pickable
    var pickable = (game.dice.indexOf(die) !== -1) || (_.max(game.dice) > die && _.every(game.board.slice(a, b), cellCheck));

    return allowPick && pickable;
};

// Returns an array of cells that the piece can move to.
moveableTo = function(gameId, from) {
    var game = Games.findOne({
        _id: gameId
    });
    var currentPlayer = game.turn % 2;

    var result = [];
    for (var j = 0; j < game.dice.length; j++) {
        // Cell that can be moved from "from" with die roll "j"
        var cellId = from + game.dice[j] * (currentPlayer ? 1 : -1);
        if (cellId >= 0 && cellId < 24 && // Cell is within game boundaries
            (game.board[cellId].color !== (currentPlayer + 1) % 2 || // Color isn't opponent's or
                game.board[cellId].count === 1)) { // There's only one piece
            result.push(cellId);
        }
    }

    return result;
};

isMoveable = function(gameId, from) {
    var game = Games.findOne({
        _id: gameId
    });
    var currentPlayer = game.turn % 2;

    return (game.board[from].color === currentPlayer && moveableTo(gameId, from).length !== 0);
};

placeableTo = function(gameId) {
    var game = Games.findOne({
        _id: gameId
    });
    var currentPlayer = game.turn % 2;

    var result = [];
    for (var i = 0; i < 6; i++) {
        // Cell that can be placed to with die roll "i"
        var cellId = currentPlayer ? i : 23 - i;
        if (game.dice.indexOf(i + 1) !== -1 && // Cell is covered by dice and
            (game.board[cellId].color !== (currentPlayer + 1) % 2 || // Color isn't opponent's or
                game.board[cellId].count === 1)) { // There's only one piece
            result.push(i);
        }
    }
    return result;
};

isPlaceable = function(gameId) {
    var game = Games.findOne({
        _id: gameId
    });
    var currentPlayer = game.turn % 2;

    return (game.broken[currentPlayer] && placeableTo(gameId).length !== 0);
};
