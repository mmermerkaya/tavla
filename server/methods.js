Meteor.methods({
    joinGame: function(id) {
        var game = Games.findOne({_id: id});

        if (game.players[0] !== Meteor.userId() && game.players.length === 1) {
            Games.update({_id: id}, {$push: {'players': Meteor.userId()}});
        }
    },

    rollDice: function() {
        var dice = [Math.ceil(Random.fraction()*6), Math.ceil(Random.fraction()*6)];
        if (dice[0] === dice[1]) {
            dice = dice.concat(dice);
        }
        return dice;
    },

    checkTurn: function(id) {
        var game = Games.findOne({_id: id});

        var moveAvailable = false;
        if (game.dice.length !== 0) {
            if (game.broken[game.turn % 2]) {
                for (var i = 0; i < 6; i++) {
                    //cell that can be placed to with die roll "i"
                    var cellId = game.turn % 2 ? i : 23-i;
                    if (game.dice.indexOf(i+1) !== -1 && //cell is covered by dice and
                        (game.board[cellId].color !== (game.turn+1) % 2 || //color isn't opponent's or
                        game.board[cellId].count === 1)) { //there's only one piece
                        moveAvailable = true;
                        break;
                    }
                }
            }
            else {
                for (var i = 0; i < 24; i++) {
                    if (game.board[i].color === (game.turn+1)%2) {
                        for (var j = 0; j < game.dice.length; j++) {
                            //cell that can be moved from "i" with die roll "j"
                            var cellId = i + game.dice[j] * (game.turn % 2 ? 1 : -1);
                            if (cellId >= 0 && cellId < 24 && //cell is within game boundaries
                                (game.board[cellId].color !== (game.turn+1) % 2 || //color isn't opponent's or
                                game.board[cellId].count === 1)) { //there's only one piece
                                moveAvailable = true;
                                break;
                            }
                        }
                    }
                }
            }
        }

        if (!moveAvailable) {
            //new turn
            var dice = Meteor.call('rollDice');
            Games.update({_id: id}, {$set: {'dice': dice}, $inc: {'turn': 1}});

            Meteor.call('checkTurn', id);
        }
    },

    newGame: function() {
        var board = [
            {
                color: 1,
                count: 2
            },
            {
                color: -1,
                count: 0
            },
            {
                color: -1,
                count: 0
            },
            {
                color: -1,
                count: 0
            },
            {
                color: -1,
                count: 0
            },
            {
                color: 0,
                count: 5
            },
            {
                color: -1,
                count: 0
            },
            {
                color: 0,
                count: 3
            },
            {
                color: -1,
                count: 0
            },
            {
                color: -1,
                count: 0
            },
            {
                color: -1,
                count: 0
            },
            {
                color: 1,
                count: 5
            },
            {
                color: 0,
                count: 5
            },
            {
                color: -1,
                count: 0
            },
            {
                color: -1,
                count: 0
            },
            {
                color: -1,
                count: 0
            },
            {
                color: 1,
                count: 3
            },
            {
                color: -1,
                count: 0
            },
            {
                color: 1,
                count: 5
            },
            {
                color: -1,
                count: 0
            },
            {
                color: -1,
                count: 0
            },
            {
                color: -1,
                count: 0
            },
            {
                color: -1,
                count: 0
            },
            {
                color: 0,
                count: 2
            },
        ];

        board.forEach(function(data, i) {
            data.id = i;
        });

        return Games.insert({
            board: board,
            dice: Meteor.call('rollDice'),
            turn: 0,
            broken: [0, 0],
            players: [Meteor.userId()]
        });
    }
});
