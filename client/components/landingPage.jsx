LandingPage = React.createClass({
    newGame() {
        Meteor.call('newGame', function(error, result) {
            if (error) {
                console.log('error', error);
            }
            FlowRouter.go('/game/' + result);
        });
    },

    render() {
        return (
            <div className="jumbotron">
                <div className="container">
                    <h1>Welcome to Tavla.io!</h1>
                    <p>You can start playing with a friend right now! No registration required.</p>
                    <p>
                        <button className="btn btn-primary" onClick={this.newGame}>
                            Start New Game
                        </button>
                    </p>
                </div>
            </div>
        );
    }
});
