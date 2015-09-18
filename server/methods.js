Meteor.methods({
    rollDice: function() {
        var dice = [Math.ceil(Random.fraction()*6), Math.ceil(Random.fraction()*6)];
        if (dice[0] === dice[1]) {
            dice = dice.concat(dice);
        }
        return dice;
    },

    newTurn: function(id) {
        var dice = Meteor.call('rollDice');
        Games.update({_id: id}, {$set: {'dice': dice}, $inc: {'turn': 1}});
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
            turn: 0
        });
    }
});