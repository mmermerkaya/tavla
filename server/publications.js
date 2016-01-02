Meteor.publish('game', function(gameId) {
    return Games.find({_id: gameId});
});
