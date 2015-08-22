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

Template.board.helpers({
  topRow: piecesData.slice(12, 24),

  bottomRow: piecesData.slice(0, 12).reverse()
});

Template.cell.events({
  'click': function clicked (event) {
    console.log('previous ' + Session.get('selected'));
    Session.set('selected', this.id);
    console.log('clicked ' + Session.get('selected'));
  }
});