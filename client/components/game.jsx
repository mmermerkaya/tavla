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
            if (game.player() === -1 && game.players.length < 2) {
                // Add user to the game
                Meteor.call('joinGame', game._id);
            }
        }.bind(this));

        return {
            ready: handle.ready(),
            game: Games.findOne({_id: this.state.gameId})
        };
    },

    render() {
        if (!this.data.ready) {
            return <SpinnerWrapper title={'Loading Game'} />;
        }

        if (this.data.game.players.length < 2) {
            // Not enough players in game
            if (this.data.game.player() === -1) {
                // User is not part of the game
                return <SpinnerWrapper title={'Joining Game'} />;
            } else {
                // Waiting for opponent
                return <SpinnerWrapper title={'Waiting for Opponent'} body={'Send the current URL to a friend to start playing! :)'}/>;
            }
        }

        return (
            <div className="container">
                {this.data.game.winner !== null ? <Modal game={this.data.game} /> : null}
                <div className="row">
                    <div className="col-md-9">
                        <Board game={this.data.game} />
                    </div>
                    <div className="col-md-3">
                        <Chat game={this.data.game} />
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
        var message;
        if (this.props.game.player() === -1) {
            message = <h4>This game is over.</h4>;
        } else if (this.props.game.player() === this.props.game.winner) {
            message = <h4>You won! Congratulations!</h4>;
        } else {
            message = <h4>You lost. Better luck next time!</h4>;
        }

        return (
            <div className="modal" data-backdrop="static">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title">This Game Is Over</h2>
                        </div>
                        <div className="modal-body">
                            {message}
                            <h2>
                                <button type="button" className="btn btn-primary" onClick={newGame}>
                                    Start A New Game!
                                </button>
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
