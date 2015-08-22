Meteor.methods({
    movePiece: function(from, to) {
        console.log(Meteor.userId() + ' requested moving from ' + from + ' to ' + to);
    }
});