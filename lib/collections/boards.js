Boards = new Mongo.Collection('boards');

Meteor.methods({
  movePiece: function(from, to) {
    var modifier = { $inc: {}, $set: {} };

    //Move piece
    modifier.$inc['data.'+from+'.count'] = -1;
    modifier.$inc['data.'+to+'.count'] = 1;

    //Remove die value from dice array
    var die = Math.abs(to - from);
    var dice = Boards.findOne().dice;
    var index = dice.indexOf(die);
    dice.splice(index, 1);
    modifier.$set['dice'] = dice;

    //Update database
    Boards.update({}, modifier);

    //New turn if no more dice left
    if(dice.length == 0) {
      Meteor.call('newTurn');
    }

    console.log(Meteor.userId() + ' requested moving from ' + from + ' to ' + to);
  },

  newTurn: function() {
    var dice = [Math.ceil(Random.fraction()*6), Math.ceil(Random.fraction()*6)]
    Boards.update({}, {$set: {'dice': dice}, $inc: {'turn': 1}});
  }
});