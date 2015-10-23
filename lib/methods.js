//Methods with latency compensation
Meteor.methods({
    //A regular move from cell A to cell B
    movePiece: function(gameId, from, to) {
        var game = Games.findOne({_id: gameId});

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
            modifier.$inc['broken.'+((game.turn+1) % 2)] = 1;
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
        Games.update({_id: gameId}, modifier);

        //Check if turn is over
        Meteor.call('checkTurn', gameId);

        console.log(Meteor.userId() + ' requested moving from ' + from + ' to ' + to);
    },

    //Put a broken piece back into the game
    putPiece: function(gameId, to) {
        var game = Games.findOne({_id: gameId});

        if (game.broken[game.turn % 2] === 0) {
            return;
        }

        var modifier = { $inc: {}, $set: {} };
        modifier.$inc['broken.'+(game.turn % 2)] = -1;

        //regular movement
        if (game.board[to].color !== (game.turn+1) % 2) {
            modifier.$inc['board.'+to+'.count'] = 1;
            modifier.$set['board.'+to+'.color'] = game.turn % 2;
        }
        //breaking movement
        else if (game.board[to].count === 1) {
            modifier.$set['board.'+to+'.color'] = game.turn % 2;
            modifier.$inc['broken.'+((game.turn+1) % 2)] = 1;
        }
        else {
            return;
        }

        //Remove die value from dice array
        var die = game.turn % 2 ? to+1 : 24-to;
        var index = game.dice.indexOf(die);
        game.dice.splice(index, 1);
        modifier.$set['dice'] = game.dice;

        //Update database
        Games.update({_id: gameId}, modifier);

        //Check if turn is over
        Meteor.call('checkTurn', gameId);

        console.log(Meteor.userId() + ' requested putting broken piece to ' + to);
    },

    pickPiece: function(gameId, from) {
        function cellCheck(cell) {
            return cell.color !== game.turn;
        }

        var game = Games.findOne({_id: gameId});

        if (game.board[from].color !== game.turn % 2) {
            return;
        }

        var a = game.turn % 2 ? from + 1 : 18;
        var b = game.turn % 2 ? 6 : from;
        var die = game.turn % 2 ? from+1 : 24-from;

        var allowPick = _.every(game.board.slice(0 + ((game.turn + 1) % 2) * 6, 18 + ((game.turn + 1) % 2) * 6), cellCheck);
        var pickable = (game.dice.indexOf(die) !== -1) || _.every(game.board.slice(a, b), cellCheck);

        if(!allowPick || !pickable) {
            return;
        }

        var modifier = { $inc: {}, $set: {} };

        //remove piece
        modifier.$inc['board.'+from+'.count'] = -1;
        if (game.board[from].count === 1) {
            modifier.$set['board.'+from+'.color'] = -1;
        }

        //put into collected
        modifier.$inc['collected.'+(game.turn % 2)] = 1;

        //Remove die value from dice array
        var index = game.dice.indexOf(die);
        if (index === -1) {
            index = game.dice.indexOf(_.max(game.dice));
        }
        game.dice.splice(index, 1);
        modifier.$set['dice'] = game.dice;

        //Update database
        Games.update({_id: gameId}, modifier);

        //Check if turn is over
        Meteor.call('checkTurn', gameId);
    }
});
