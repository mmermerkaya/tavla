Meteor.startup(function () {
  Session.set('selected', null);
});

Template.board.helpers({
  topRow: function() {
    var board = Boards.findOne();
    if(!board) {
      return null;
    }
    return board.data.slice(12, 24);
  },

  bottomRow: function() {
    var board = Boards.findOne();
    if(!board) {
      return null;
    }
    return board.data.slice(0, 12).reverse();
  }
});

Template.cell.helpers({
  selectedClass: function() {
    if (this.id == Session.get('selected')) {
      return 'selected';
    }
  }
})

Template.cell.events({
  'click': function clicked (event) {
    if (Session.get('selected') === null) {
      console.log('selected ' + this.id);
      Session.set('selected', this.id);
    }
    else if (Session.get('selected') === this.id) {
      console.log('deselected ' + this.id);
      Session.set('selected', null);
    }
    else {
      console.log('moving ' + Session.get('selected') + ' to ' + this.id);
      Meteor.call('movePiece', Session.get('selected'), this.id, function(error, response){});
      Session.set('selected', null);
    }
  }
});