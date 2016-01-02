// Methods with latency compensation
Meteor.methods({
    // A regular move from cell A to cell B
    movePiece: function(gameId, from, to) {
        var game = Games.findOne({
            _id: gameId
        });

        if (game.board[from].color !== game.turn % 2) {
            return;
        }

        var modifier = {
            $inc: {},
            $set: {}
        };
        // Regular movement
        if (game.board[to].color !== (game.turn + 1) % 2) {
            modifier.$inc['board.' + from + '.count'] = -1;
            if (game.board[from].count === 1) {
                modifier.$set['board.' + from + '.color'] = -1;
            }
            modifier.$inc['board.' + to + '.count'] = 1;
            modifier.$set['board.' + to + '.color'] = game.turn % 2;
        }

        // Breaking movement
        else if (game.board[to].count === 1) {
            modifier.$inc['board.' + from + '.count'] = -1;
            if (game.board[from].count === 1) {
                modifier.$set['board.' + from + '.color'] = -1;
            }
            modifier.$set['board.' + to + '.color'] = game.turn % 2;
            modifier.$inc['broken.' + ((game.turn + 1) % 2)] = 1;
        }
        else {
            return;
        }

        // Remove die value from dice array
        var die = Math.abs(to - from);
        var index = game.dice.indexOf(die);
        game.dice.splice(index, 1);
        modifier.$set.dice = game.dice;

        // Update database
        Games.update({
            _id: gameId
        }, modifier);

        // Check if turn is over
        Meteor.call('checkTurn', gameId);

        console.log(Meteor.userId() + ' requested moving from ' + from + ' to ' + to);
    },

    // Put a broken piece back into the game
    putPiece: function(gameId, to) {
        var game = Games.findOne({
            _id: gameId
        });

        if (game.broken[game.turn % 2] === 0) {
            return;
        }

        var modifier = {
            $inc: {},
            $set: {}
        };
        modifier.$inc['broken.' + (game.turn % 2)] = -1;

        // Regular movement
        if (game.board[to].color !== (game.turn + 1) % 2) {
            modifier.$inc['board.' + to + '.count'] = 1;
            modifier.$set['board.' + to + '.color'] = game.turn % 2;
        }
        // Breaking movement
        else if (game.board[to].count === 1) {
            modifier.$set['board.' + to + '.color'] = game.turn % 2;
            modifier.$inc['broken.' + ((game.turn + 1) % 2)] = 1;
        }
        else {
            return;
        }

        // Remove die value from dice array
        var die = game.turn % 2 ? to + 1 : 24 - to;
        var index = game.dice.indexOf(die);
        game.dice.splice(index, 1);
        modifier.$set.dice = game.dice;

        // Update database
        Games.update({
            _id: gameId
        }, modifier);

        // Check if turn is over
        Meteor.call('checkTurn', gameId);

        console.log(Meteor.userId() + ' requested putting broken piece to ' + to);
    },

    collectPiece: function(gameId, from) {
        var game = Games.findOne({
            _id: gameId
        });
        var currentPlayer = game.turn % 2;

        if (!isCollectable(gameId, from)) {
            return;
        }

        var modifier = {
            $inc: {},
            $set: {}
        };

        // Remove piece
        modifier.$inc['board.' + from + '.count'] = -1;
        if (game.board[from].count === 1) {
            modifier.$set['board.' + from + '.color'] = -1;
        }

        // Put into collected
        modifier.$inc['collected.' + (currentPlayer)] = 1;

        // Find compatible die value
        var die = currentPlayer === 0 ? from + 1 : 24 - from;
        die = _.max([_.min(game.dice), die]);

        // Remove die value from dice array
        var index = game.dice.indexOf(die);
        if (index === -1) {
            index = game.dice.indexOf(_.max(game.dice));
        }
        game.dice.splice(index, 1);
        modifier.$set.dice = game.dice;

        // Update database
        Games.update({
            _id: gameId
        }, modifier);

        // Check if turn is over
        Meteor.call('checkTurn', gameId);
    }
});

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
