Games = new Mongo.Collection('games');

Meteor.methods({
    movePiece: function(id, from, to) {
        var game = Games.findOne({_id: id});

        if (game.board[from].color !== game.turn % 2) {
            return;
        }

        var modifier = { $inc: {}, $set: {} };
        //regular movement
        if (game.board[to].color !== (game.turn+1) % 2) {
            modifier.$inc['board.'+from+'.count'] = -1;
            if (game.board[from].count === 1) {
                modifier.$set['board.'+from+'.color'] = -1;
            }
            modifier.$inc['board.'+to+'.count'] = 1;
            modifier.$set['board.'+to+'.color'] = game.turn % 2;
        }

        //breaking movement
        else if (game.board[to].count === 1) {
            modifier.$inc['board.'+from+'.count'] = -1;
            if (game.board[from].count === 1) {
                modifier.$set['board.'+from+'.color'] = -1;
            }
            modifier.$set['board.'+to+'.color'] = game.turn % 2;
            modifier.$inc['broken.count'] = 1;
            modifier.$set['broken.color'] = (game.turn+1) % 2;
        }

        else {
            return;
        }

        //Remove die value from dice array
        var die = Math.abs(to - from);
        var index = game.dice.indexOf(die);
        game.dice.splice(index, 1);
        modifier.$set['dice'] = game.dice;

        //Update database
        Games.update({_id: id}, modifier);

        //New turn if no more dice left
        if(game.dice.length == 0) {
            Meteor.call('newTurn', id);
        }

        console.log(Meteor.userId() + ' requested moving from ' + from + ' to ' + to);
    },
});
