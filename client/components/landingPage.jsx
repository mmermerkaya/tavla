LandingPage = React.createClass({
    render() {
        return (
            <div className="jumbotron">
                <div className="container">
                    <h1>Welcome to Tavla.io!</h1>
                    <p>You can start playing with a friend right now! No registration required.</p>
                    <p>
                        <button className="btn btn-primary" onClick={newGame}>
                            Start New Game
                        </button>
                    </p>
                </div>
            </div>
        );
    }
});
