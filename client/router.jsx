FlowRouter.route('/', {
    action: function() {
        ReactLayout.render(App, {content: <LandingPage />});
    }
});

FlowRouter.route('/game/:gameId', {
    action: function() {
        Tracker.autorun(function() {
            if (Meteor.userId()) {
                ReactLayout.render(App, {content: <Board />});
            }
        })
    }
});
