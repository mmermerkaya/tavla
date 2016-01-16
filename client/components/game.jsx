Game = React.createClass({
    mixins: [ReactMeteorData],

    getInitialState() {
        return {
            gameId: FlowRouter.getParam('gameId')
        };
    },

    getMeteorData() {
        var handle = Meteor.subscribe('game', this.state.gameId, function onReady() {
            // onReady callback
            var game = Games.findOne({_id: this.state.gameId});
            if (game.players.indexOf(Meteor.userId()) === -1 && game.players.length < 2) {
                // Add user to the game
                Meteor.call('joinGame', game._id);
            }
        }.bind(this));

        return {
            ready: handle.ready(),
            game: Games.findOne({_id: FlowRouter.getParam('gameId')})
        };
    },

    render() {
        if (!this.data.ready) {
            return <SpinnerWrapper title={'Loading Game'} />;
        }

        var player = this.data.game.players.indexOf(Meteor.userId());
        if (this.data.game.players.length < 2) {
            // Not enough players in game
            if (player === -1) {
                // User is not part of the game
                return <SpinnerWrapper title={'Joining Game'} />;
            } else {
                // Waiting for opponent
                return <SpinnerWrapper title={'Waiting for Opponent'} body={'Send the current URL to a friend to start playing! :)'}/>;
            }
        } else if (player === -1) {
            // User is not part of the game
            // TODO: Redirect and show error message
            return null;
        }

        return (
            <div className="container">
                {this.data.game.winner !== null ? <Modal won={this.data.game.winner === player} /> : null}
                <div className="row">
                    <div className="col-md-9">
                        <Board game={this.data.game} player={player} />
                    </div>
                    <div className="col-md-3">
                        <Chat game={this.data.game} player={player} />
                    </div>
                </div>
            </div>
        );
    }
});

// FIXME: newGame does not work.
Modal = React.createClass({
    componentDidMount() {
        $(this.getDOMNode()).modal('show');
    },
    componentWillUnmount: function() {
        $(this.getDOMNode()).modal('hide');
    },
    render() {
        return (
            <div className="modal" data-backdrop="static">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title">This Game Is Over</h2>
                        </div>
                        <div className="modal-body">
                            {this.props.won ? <h4>You won! Congratulations!</h4> : <h4>You lost. Better luck next time!</h4>}
                            <h2><button type="button" className="btn btn-primary" onClick={newGame}>
                                Start A New Game!
                            </button></h2>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
