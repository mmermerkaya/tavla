Meteor.publish('game', function(gameId) {
    return Games.find({_id: gameId});
});

Meteor.publish('gameList', function() {
    return Games.find({});
});
