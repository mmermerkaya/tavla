Board = React.createClass({
    // This mixin makes the getMeteorData method work
    mixins: [ReactMeteorData],

    // Loads items from the Games collection and puts them on this.data.game
    getMeteorData() {
        return {
            game: Games.findOne({_id: FlowRouter.getParam('gameId')}),
            userId: Meteor.userId()
        }
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

    topLeftRow() {
        if (this.data.game.players[0] === this.data.userId) {
            return this.data.game.board.slice(12, 18);
        }
        else if (this.data.game.players[1] === this.data.userId) {
            return this.data.game.board.slice(6, 12).reverse();
        }
    },

    topRightRow() {
        if (this.data.game.players[0] === this.data.userId) {
            return this.data.game.board.slice(18, 24);
        }
        else if (this.data.game.players[1] === this.data.userId) {
            return this.data.game.board.slice(0, 6).reverse();
        }
    },

    bottomLeftRow() {
        if (this.data.game.players[0] === this.data.userId) {
            return this.data.game.board.slice(6, 12).reverse();
        }
        else if (this.data.game.players[1] === this.data.userId) {
            return this.data.game.board.slice(12, 18);
        }
    },

    bottomRightRow() {
        if (this.data.game.players[0] === this.data.userId) {
            return this.data.game.board.slice(0, 6).reverse();
        }
        else if (this.data.game.players[1] === this.data.userId) {
            return this.data.game.board.slice(18, 24);
        }
    },

    cellClickHandler(cellId) {
        console.log(cellId);

        if (this.data.game.players.indexOf(this.data.userId) !== this.data.game.turn % 2) {
            return;
        }

        //If player can move
        if (this.data.game.broken[this.data.game.turn % 2] === 0) {
            //If player clicked on an idle cell
            if (this.getCellState(cellId) === 'idle') {
                if (this.data.game.board[cellId].color === this.data.game.turn % 2) {
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
                //If player clicked on a moveable cell
                if (this.getCellState(cellId) === 'moveable') {
                    console.log('moving ' + this.state.selected + ' to ' + cellId);
                    Meteor.call('movePiece', this.data.game._id, this.state.selected, cellId);
                }
                this.deselect();
            }
        }
        //if player has broken pieces
        else {
            if (this.getCellState(cellId) === 'moveable') {
                console.log('moving ' + this.state.selected + ' to ' + cellId);
                Meteor.call('putPiece', this.data.game._id, cellId);
            }
        }
    },

    collectionClickHandler(color) {
        if (this.data.game.broken[this.data.game.turn % 2] === 0 && this.getCollectionState(color) === 'moveable') {
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
        //If it's not local player's turn, all cells default to idle.
        if (this.data.game.players.indexOf(this.data.userId) !== this.data.game.turn % 2) {
            return 'idle';
        }

        //no broken pieces
        if (this.data.game.broken[this.data.game.turn % 2] === 0) {
            if (cellId === this.state.selected) {
                return 'selected';
            }
            else if (this.state.selected !== null) {
                //required die value for this move
                var val = (this.state.selected - cellId) * (this.data.game.turn % 2 ? -1 : 1);
                if (this.data.game.dice.indexOf(val) !== -1 && //Distance is covered by dice and
                    (this.data.game.board[cellId].color !== (this.data.game.turn+1) % 2 || //color isn't opponent's or
                    this.data.game.board[cellId].count === 1)) { //there's only one piece (breakable)
                    return 'moveable';
                }
            }
        }
        else {
            //required die value for this move
            var val = this.data.game.turn % 2 ? cellId+1 : 24-cellId;
            if (this.data.game.dice.indexOf(val) !== -1 && //Distance is covered by dice and
                (this.data.game.board[cellId].color !== (this.data.game.turn+1) % 2 || //color isn't opponent's or
                this.data.game.board[cellId].count === 1)) { //there's only one piece
                return 'moveable';
            }
        }
        return 'idle';
    },

    getCollectionState(color) {
        //If it's not local player's turn, all cells default to idle.
        if (color !== this.data.game.turn % 2 || this.data.game.players.indexOf(this.data.userId) !== this.data.game.turn % 2 || this.state.selected === null) {
            return 'idle';
        }
        var self = this;
        function cellCheck(cell) {
            return cell.color !== self.data.game.turn % 2;
        };

        var a = this.data.game.turn % 2 === 0 ? this.state.selected + 1 : 18;
        var b = this.data.game.turn % 2 === 0 ? 6 : this.state.selected;
        var die = this.data.game.turn % 2 === 0 ? this.state.selected+1 : 24-this.state.selected;

        if (_.every(this.data.game.board.slice(0 + ((this.data.game.turn + 1) % 2) * 6, 18 + ((this.data.game.turn + 1) % 2) * 6), cellCheck)
            && ((this.data.game.dice.indexOf(die) !== -1) || (_.max(this.data.game.dice) > die && _.every(this.data.game.board.slice(a, b), cellCheck)))) {
            return 'moveable';
        }
        return 'idle';
    },

    renderCellTop(cell, key) {
        cell.state = this.getCellState(cell.id);
        return (
            <div className="cell top" key={key}>
                <Cell cellData={cell} clickHandler={this.cellClickHandler} />
            </div>
        );
    },

    renderCellBottom(cell, key) {
        cell.state = this.getCellState(cell.id);
        return (
            <div className="cell bottom" key={key}>
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
                <SpinnerView />
            );
        }

        return (
            <div className="game">
                <div className="board-bg">
                    <div className="board">
                        <div className="row">
                            {this.topLeftRow().map(this.renderCellTop)}
                            <div className="separator" />
                            {this.topRightRow().map(this.renderCellTop)}
                        </div>
                        <div className="row">
                            {this.bottomLeftRow().map(this.renderCellBottom)}
                            <div className="separator" />
                            {this.bottomRightRow().map(this.renderCellBottom)}
                        </div>
                    </div>
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
                            <td>{this.data.game.players.indexOf(this.data.userId)}</td>
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
