Games = new Mongo.Collection('games');

Games.helpers({
    player: function(userId) {
        return this.players.indexOf(userId ? userId : Meteor.userId());
    },
    status: function() {
        if (this.players.length < 2) {
            return 'Open';
        } else if (this.winner !== null) {
            return 'Over';
        } else {
            return 'In Progress';
        }
    }
});
