Meteor.startup(function () {
  Session.set('selected', null);
});

Template.board.helpers({
  topRow: function() {
    var board = Boards.findOne({_id: FlowRouter.getParam('gameId')});
    if(!board) {
      return null;
    }
    return board.data.slice(12, 24);
  },

  bottomRow: function() {
    var board = Boards.findOne({_id: FlowRouter.getParam('gameId')});
    if(!board) {
      return null;
    }
    return board.data.slice(0, 12).reverse();
  },

  dice: function() {
    var board = Boards.findOne({_id: FlowRouter.getParam('gameId')});
    if(!board) {
      return null;
    }
    return board.dice;
  },

  turn: function() {
    var board = Boards.findOne({_id: FlowRouter.getParam('gameId')});
    if(!board) {
      return null;
    }
    return board.turn;
  },
});

Template.cell.helpers({
  cssClass: function() {
    if (this.id == Session.get('selected')) {
      return 'selected';
    }
    
    if (Session.get('selected') !== null) {
      var board = Boards.findOne({_id: FlowRouter.getParam('gameId')});
      var dir = board.turn % 2 ? 1: -1;
      if (board.dice.indexOf((this.id * -dir) + (Session.get('selected') * dir)) !== -1) {
        return 'moveable';
      }
    }
    return 'idle';
  }
})

Template.cell.events({
  'click .idle': function idle(event) {
    console.log('selected ' + this.id);
    Session.set('selected', this.id);
  },

  'click .selected': function selected(event) {
    console.log('deselected ' + this.id);
    Session.set('selected', null);
  },

  'click .moveable': function available(event) {
    console.log('moving ' + Session.get('selected') + ' to ' + this.id);
    Meteor.call('movePiece', FlowRouter.getParam('gameId'), Session.get('selected'), this.id);
    Session.set('selected', null);
  }
});

Template.landingPage.events({
  'click .newGame': function newGame(event) {
    Meteor.call('newGame', function(error, result) {
      if (error) {
        console.log('error', error);
      }
      console.log(result);
      FlowRouter.go('/game/' + result);
    });
  }
});