// Methods without latency compensation
Meteor.methods({
    joinGame: function(gameId) {
        var game = Games.findOne({
            _id: gameId
        });

        if (game.players[0] !== Meteor.userId() && game.players.length === 1) {
            Games.update({
                _id: gameId
            }, {
                $push: {
                    'players': Meteor.userId()
                }
            });
        }
    },

    rollDice: function() {
        var dice = [Math.ceil(Random.fraction() * 6), Math.ceil(Random.fraction() * 6)];
        if (dice[0] === dice[1]) {
            dice = dice.concat(dice);
        }
        return dice;
    },

    // Check if turn is finished
    // Called after every move
    checkTurn: function(gameId) {
        var game = Games.findOne({
            _id: gameId
        });
        var currentPlayer = game.turn % 2;

        if (game.collected[currentPlayer] === 15) {
            Games.update({
                _id: gameId
            }, {
                $set: {
                    'winner': currentPlayer
                }
            });
        }

        var moveAvailable = false;
        if (game.dice.length !== 0) {
            // If player has broken pieces
            if (game.broken[currentPlayer]) {
                moveAvailable = isPlaceable(gameId);
            } else {
                for (var i = 0; i < 24; i++) {
                    if (isCollectable(gameId, i) || isMoveable(gameId, i)) {
                        moveAvailable = true;
                        break;
                    }
                }
            }
        }

        if (!moveAvailable) {
            // New turn
            var dice = Meteor.call('rollDice');
            Games.update({
                _id: gameId
            }, {
                $set: {
                    'dice': dice
                },
                $inc: {
                    'turn': 1
                }
            });

            // Wait 3 seconds before checking if turn will be skipped again.
            Meteor.setTimeout(function() {
                Meteor.call('checkTurn', gameId);
            }, 5000);
        }
    },

    newGame: function() {
        var board = [{
            color: 1,
            count: 2
        }, {
            color: -1,
            count: 0
        }, {
            color: -1,
            count: 0
        }, {
            color: -1,
            count: 0
        }, {
            color: -1,
            count: 0
        }, {
            color: 0,
            count: 5
        }, {
            color: -1,
            count: 0
        }, {
            color: 0,
            count: 3
        }, {
            color: -1,
            count: 0
        }, {
            color: -1,
            count: 0
        }, {
            color: -1,
            count: 0
        }, {
            color: 1,
            count: 5
        }, {
            color: 0,
            count: 5
        }, {
            color: -1,
            count: 0
        }, {
            color: -1,
            count: 0
        }, {
            color: -1,
            count: 0
        }, {
            color: 1,
            count: 3
        }, {
            color: -1,
            count: 0
        }, {
            color: 1,
            count: 5
        }, {
            color: -1,
            count: 0
        }, {
            color: -1,
            count: 0
        }, {
            color: -1,
            count: 0
        }, {
            color: -1,
            count: 0
        }, {
            color: 0,
            count: 2
        }, ];

        board.forEach(function(data, i) {
            data.id = i;
        });

        return Games.insert({
            board: board,
            dice: Meteor.call('rollDice'),
            turn: 0,
            broken: [0, 0],
            players: [Meteor.userId()],
            collected: [0, 0],
            winner: null
        });
    }
});
