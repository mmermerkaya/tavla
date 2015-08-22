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

Template.board.helpers({
  pieces: piecesData,

  topRow: piecesData.slice(12, 24),

  bottomRow: piecesData.slice(0, 12).reverse()
});
