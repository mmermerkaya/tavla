Board = React.createClass({
    getInitialState() {
        return {
            selected: null
        };
    },

    // Returns cells from a quarter of the board.
    // Index goes counter clockwise and starts at bottom right.
    getSegment(index) {
        var result = [];
        if (this.props.game.player() !== 1) {
            // Player one and spectators
            result = this.props.game.board.slice(index * 6, (index + 1) * 6);
            if (index < 2) {
                result = result.reverse();
            }
        } else {
            // Player 2
            result = this.props.game.board.slice((3 - index) * 6, (3 - index + 1) * 6);
            if (index >= 2) {
                result = result.reverse();
            }
        }
        return result;
    },

    cellClickHandler(cellId) {
        if (this.props.game.player() !== this.props.game.turn % 2) {
            return;
        }

        // If player can move
        if (this.props.game.broken[this.props.game.player()] === 0) {
            // If player clicked on an idle cell
            if (this.getCellState(cellId) === 'idle') {
                if (this.props.game.board[cellId].color === this.props.game.player()) {
                    console.log('selected ' + cellId);

                    this.setState({
                        selected: cellId
                    });
                } else {
                    this.deselect();
                }
            } else {
                // If player clicked on a moveable cell
                if (this.getCellState(cellId) === 'moveable') {
                    console.log('moving ' + this.state.selected + ' to ' + cellId);
                    Meteor.call('movePiece', this.props.game._id, this.state.selected, cellId);
                }
                this.deselect();
            }
        } else if (this.getCellState(cellId) === 'moveable') {
            // If player has broken pieces
            console.log('moving ' + this.state.selected + ' to ' + cellId);
            Meteor.call('putPiece', this.props.game._id, cellId);
        }
    },

    collectionClickHandler() {
        if (this.props.game.player() === this.props.game.turn % 2 &&
            this.props.game.broken[this.props.game.player()] === 0 &&
            this.getCollectionState() === 'moveable') {
            console.log('collecting ' + this.state.selected);
            Meteor.call('collectPiece', this.props.game._id, this.state.selected);
            this.deselect();
        }
    },

    deselect() {
        this.setState({
            selected: null
        });
    },

    getCellState(cellId) {
        // If it's not local player's turn, all cells default to idle.
        if (this.props.game.player() !== this.props.game.turn % 2) {
            return 'idle';
        }

        // No broken pieces
        if (this.props.game.broken[this.props.game.player()] === 0) {
            if (cellId === this.state.selected) {
                return 'selected';
            } else if (this.state.selected !== null) {
                if (moveableTo(this.props.game._id, this.state.selected).indexOf(cellId) !== -1) {
                    return 'moveable';
                }
            }
        } else {
            // Required die value for this move
            var val = this.props.game.player() ? cellId + 1 : 24 - cellId;
            if (this.props.game.dice.indexOf(val) !== -1 && // Distance is covered by dice and
                (this.props.game.board[cellId].color !== (this.props.game.player() + 1) % 2 || // Color isn't opponent's or
                this.props.game.board[cellId].count === 1)) { // There's only one piece
                return 'moveable';
            }
        }
        return 'idle';
    },

    getCollectionState() {
        // If it's not local player's turn, no collection is possible.
        if (this.props.game.player() !== this.props.game.turn % 2 || this.state.selected === null) {
            return 'idle';
        }

        var cellCheck = function(cell) {
            return cell.color !== this.props.game.player();
        }.bind(this);

        var a = this.props.game.player() === 0 ? this.state.selected + 1 : 18;
        var b = this.props.game.player() === 0 ? 6 : this.state.selected;
        var die = this.props.game.player() === 0 ? this.state.selected + 1 : 24 - this.state.selected;

        if (_.every(this.props.game.board.slice(0 + ((this.props.game.player() + 1) % 2) * 6, 18 + ((this.props.game.player() + 1) % 2) * 6), cellCheck)
            && ((this.props.game.dice.indexOf(die) !== -1) || (_.max(this.props.game.dice) > die && _.every(this.props.game.board.slice(a, b), cellCheck)))) {
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
        return (
            <div className="game">
                <div className="board-bg centered">
                    <div className="board">
                        <div className="row">
                            {this.getSegment(2).map(function(segment, index) {
                                return this.renderCell(segment, index, "top");
                            }.bind(this))}
                            <div className="separator top">
                                <Cell cellData={{state: 'idle', color: (this.props.game.player() + 1) % 2, count: this.props.game.broken[(this.props.game.player() + 1) % 2]}} />
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
                                <Cell cellData={{state: 'idle', color: this.props.game.player(), count: this.props.game.broken[this.props.game.player()]}} />
                            </div>
                            {this.getSegment(0).map(function(segment, index) {
                                return this.renderCell(segment, index, "bottom");
                            }.bind(this))}
                        </div>
                    </div>
                </div>
                <br />
                <div
                    disabled={this.getCollectionState(this.props.game.turn % 2) === 'idle'}
                    className={"collect btn btn-" + getBootstrapColor(this.getCollectionState(this.props.game.turn % 2), this.props.game.turn % 2)}
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
                            <td>{this.props.game.player()}</td>
                            <td>{this.props.game.dice.toString()}</td>
                            <td>{this.props.game.turn}</td>
                            <td>{this.props.game.broken[0]} / {this.props.game.broken[1]}</td>
                            <td>{this.props.game.collected[0]} / {this.props.game.collected[1]}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
});
