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

Meteor.startup(function () {
  Session.set('selected', null);
});

Template.board.helpers({
  topRow: piecesData.slice(12, 24),

  bottomRow: piecesData.slice(0, 12).reverse()
});

Template.cell.events({
  'click': function clicked (event) {
    if (Session.get('selected') === null) {
      console.log('selected ' + this.id);
      Session.set('selected', this.id);
    }
    else {
      console.log('moving ' + Session.get('selected') + ' to ' + this.id);
      Session.set('selected', null);
    }
  }
});