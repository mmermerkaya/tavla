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
  cssClass: function() {
    var board = Boards.findOne();

    if (this.id == Session.get('selected')) {
      return 'selected';
    }
    if (Session.get('selected') !== null && board.dice.indexOf(this.id - Session.get('selected')) !== -1) {
      return 'moveable';
    }
    return 'idle';
  }
})

Template.cell.events({
  'click .idle': function idle (event) {
    console.log('selected ' + this.id);
    Session.set('selected', this.id);
  },

  'click .selected': function selected (event) {
    console.log('deselected ' + this.id);
    Session.set('selected', null);
  },

  'click .moveable': function available (event) {
    console.log('moving ' + Session.get('selected') + ' to ' + this.id);
    Meteor.call('movePiece', Session.get('selected'), this.id, function(error, response){});
    Session.set('selected', null);
  }
});