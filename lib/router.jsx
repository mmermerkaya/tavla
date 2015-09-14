FlowRouter.route('/', {
    action: function() {
        ReactLayout.render(App, {
            content() {
                return <LandingPage />;
            }
        });
    }
});

FlowRouter.route('/game/:gameId', {
    action: function() {
        ReactLayout.render(App, {
            content() {
                return <Board />;
            }
        });
    }
});
