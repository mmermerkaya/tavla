Games = new Mongo.Collection('games');

Meteor.methods({
    movePiece: function(id, from, to) {
        var modifier = { $inc: {}, $set: {} };

        //Move piece
        modifier.$inc['board.'+from+'.count'] = -1;
        modifier.$inc['board.'+to+'.count'] = 1;

        //Remove die value from dice array
        var die = Math.abs(to - from);
        var dice = Games.findOne({_id: id}).dice;
        var index = dice.indexOf(die);
        dice.splice(index, 1);
        modifier.$set['dice'] = dice;

        //Update database
        Games.update({_id: id}, modifier);

        //New turn if no more dice left
        if(dice.length == 0) {
            Meteor.call('newTurn', id);
        }

        console.log(Meteor.userId() + ' requested moving from ' + from + ' to ' + to);
    },
});
