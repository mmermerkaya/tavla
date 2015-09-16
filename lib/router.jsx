FlowRouter.route('/', {
    action: function() {
        ReactLayout.render(App, {content: <LandingPage />});
    }
});

FlowRouter.route('/game/:gameId', {
    action: function() {
        ReactLayout.render(App, {content: <Board />});
    }
});
