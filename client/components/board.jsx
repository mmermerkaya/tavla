Board = React.createClass({
    // This mixin makes the getMeteorData method work
    mixins: [ReactMeteorData],

    // Loads items from the Games collection and puts them on this.data.game
    getMeteorData() {
        return {
            game: Games.findOne({_id: this.props.gameId}),
            userId: Meteor.userId()
        };
    },

    getInitialState() {
        return {
            selected: null
        };
    },

    componentWillMount() {
        if (this.data.game.players.indexOf(this.data.userId) === -1 && this.data.game.players.length === 1) {
            Meteor.call('joinGame', this.data.game._id);
        }
    },

    // Returns cells from a quarter of the board.
    // Index goes counter clockwise and starts at bottom right.
    getSegment(index) {
        var result = [];
        if (this.data.game.players[0] === this.data.userId) {
            result = this.data.game.board.slice(index * 6, (index + 1) * 6);
            if (index < 2) {
                result = result.reverse();
            }
        }
        else if (this.data.game.players[1] === this.data.userId) {
            result = this.data.game.board.slice((3 - index) * 6, (3 - index + 1) * 6);
            if (index >= 2) {
                result = result.reverse();
            }
        }
        return result;
    },

    cellClickHandler(cellId) {
        var player = this.data.game.players.indexOf(this.data.userId);

        if (player !== this.data.game.turn % 2) {
            return;
        }

        // If player can move
        if (this.data.game.broken[player] === 0) {
            // If player clicked on an idle cell
            if (this.getCellState(cellId) === 'idle') {
                if (this.data.game.board[cellId].color === player) {
                    console.log('selected ' + cellId);

                    this.setState({
                        selected: cellId
                    });
                }
                else {
                    this.deselect();
                }
            }
            else {
                // If player clicked on a moveable cell
                if (this.getCellState(cellId) === 'moveable') {
                    console.log('moving ' + this.state.selected + ' to ' + cellId);
                    Meteor.call('movePiece', this.data.game._id, this.state.selected, cellId);
                }
                this.deselect();
            }
        }
        // If player has broken pieces
        else {
            if (this.getCellState(cellId) === 'moveable') {
                console.log('moving ' + this.state.selected + ' to ' + cellId);
                Meteor.call('putPiece', this.data.game._id, cellId);
            }
        }
    },

    collectionClickHandler() {
        var player = this.data.game.players.indexOf(this.data.userId);

        if (player === this.data.game.turn % 2 &&
            this.data.game.broken[player] === 0 &&
            this.getCollectionState() === 'moveable') {
            console.log('collecting ' + this.state.selected);
            Meteor.call('collectPiece', this.data.game._id, this.state.selected);
            this.deselect();
        }
    },

    deselect() {
        this.setState({
            selected: null
        });
    },

    getCellState(cellId) {
        var player = this.data.game.players.indexOf(this.data.userId);

        // If it's not local player's turn, all cells default to idle.
        if (player !== this.data.game.turn % 2) {
            return 'idle';
        }

        // No broken pieces
        if (this.data.game.broken[player] === 0) {
            if (cellId === this.state.selected) {
                return 'selected';
            }
            else if (this.state.selected !== null) {
                if (moveableTo(this.data.game._id, this.state.selected).indexOf(cellId) !== -1) {
                    return 'moveable';
                }
            }
        }
        else {
            // Required die value for this move
            var val = player ? cellId + 1 : 24 - cellId;
            if (this.data.game.dice.indexOf(val) !== -1 && // Distance is covered by dice and
                (this.data.game.board[cellId].color !== (player + 1) % 2 || // Color isn't opponent's or
                this.data.game.board[cellId].count === 1)) { // There's only one piece
                return 'moveable';
            }
        }
        return 'idle';
    },

    getCollectionState() {
        var player = this.data.game.players.indexOf(this.data.userId);

        // If it's not local player's turn, no collection is possible.
        if (player !== this.data.game.turn % 2 || this.state.selected === null) {
            return 'idle';
        }

        var cellCheck = function(cell) {
            return cell.color !== player;
        };

        var a = player === 0 ? this.state.selected + 1 : 18;
        var b = player === 0 ? 6 : this.state.selected;
        var die = player === 0 ? this.state.selected + 1 : 24 - this.state.selected;

        if (_.every(this.data.game.board.slice(0 + ((player + 1) % 2) * 6, 18 + ((player + 1) % 2) * 6), cellCheck)
            && ((this.data.game.dice.indexOf(die) !== -1) || (_.max(this.data.game.dice) > die && _.every(this.data.game.board.slice(a, b), cellCheck)))) {
            return 'moveable';
        }
        return 'idle';
    },

    renderCell(cell, index, row) {
        cell.state = this.getCellState(cell.id);

        return (
            <div className={"cell " + row} key={index}>
                <Cell cellData={cell} clickHandler={this.cellClickHandler} />
            </div>
        );
    },

    render() {
        // If user isn't part of the game
        // TODO: Redirect and show error message
        if (this.data.game.players.indexOf(this.data.userId) === -1) {
            return null;
        }

        // Waiting for opponent
        if (this.data.game.players.length < 2) {
            return (
                <SpinnerWrapper title='Waiting for Opponent' />
            );
        }

        var player = this.data.game.players.indexOf(this.data.userId);

        return (
            <div className="game">
                <div className="board-bg centered">
                    <div className="board">
                        <div className="row">
                            {this.getSegment(2).map(function(segment, index) {
                                return this.renderCell(segment, index, "top");
                            }.bind(this))}
                            <div className="separator top">
                                <Cell cellData={{state: 'idle', color: (player + 1) % 2, count: this.data.game.broken[(player + 1) % 2]}} />
                            </div>
                            {this.getSegment(3).map(function(segment, index) {
                                return this.renderCell(segment, index, "top");
                            }.bind(this))}
                        </div>
                        <div className="row">
                            {this.getSegment(1).map(function(segment, index) {
                                return this.renderCell(segment, index, "bottom");
                            }.bind(this))}
                            <div className="separator bottom">
                                <Cell cellData={{state: 'idle', color: player, count: this.data.game.broken[player]}} />
                            </div>
                            {this.getSegment(0).map(function(segment, index) {
                                return this.renderCell(segment, index, "bottom");
                            }.bind(this))}
                        </div>
                    </div>
                </div>
                <br />
                <div
                    className={"collect btn btn-" + getBootstrapColor(this.getCollectionState(this.data.game.turn % 2), this.data.game.turn % 2)}
                    onClick={this.collectionClickHandler}>
                    COLLECT THIS
                </div>
                <br />
                <table className="table">
                    <thead>
                        <tr>
                            <td>Player</td>
                            <td>Dice</td>
                            <td>Turn</td>
                            <td>Broken</td>
                            <td>Collected</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{player}</td>
                            <td>{this.data.game.dice.toString()}</td>
                            <td>{this.data.game.turn}</td>
                            <td>{this.data.game.broken[0]} / {this.data.game.broken[1]}</td>
                            <td>{this.data.game.collected[0]} / {this.data.game.collected[1]}</td>
                        </tr>
                    </tbody>
                </table>


            </div>
        );
    }
});
