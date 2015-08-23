Meteor.methods({
  movePiece: function(from, to) {
    console.log(Meteor.userId() + ' requested moving from ' + from + ' to ' + to);
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
      dices: [6, 2]
    });
  }
});
