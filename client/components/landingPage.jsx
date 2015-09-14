LandingPage = React.createClass({
    newGame(event) {
        Meteor.call('newGame', function(error, result) {
            if (error) {
                console.log('error', error);
            }
            console.log(result);
            FlowRouter.go('/game/' + result);
        });
    },

    render() {
        return (
            <div className="landingPage">
                <h1>Welcome to Tavla!</h1>
                <button className="newGame" onClick={this.newGame}>
                    New Game
                </button>
            </div>
        );
    }
});
