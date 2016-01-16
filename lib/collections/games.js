Games = new Mongo.Collection('games');

Games.helpers({
    player: function(userId) {
        return this.players.indexOf(userId ? userId : Meteor.userId());
    }
});
