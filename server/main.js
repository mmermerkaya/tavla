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

Meteor.startup(function () {
  if (Boards.find().count() === 0) {
    var piecesData = [
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

    piecesData.forEach(function(data, i) {
      data.id = i;
    }),

    Boards.insert({
      data: piecesData,
      dice: [6, 2],
      turn: 0
    });
  }
});
