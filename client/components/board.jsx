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

        if (this.data.game.broken[this.data.game.turn % 2] === 0) {
            if (cellId === this.state.selected) {
                return 'selected';
            }
            else if (this.state.selected !== null) {
                //required die value for this move
                var val = (this.state.selected - cellId) * (this.data.game.turn % 2 ? -1 : 1);
                if (this.data.game.dice.indexOf(val) !== -1 && //Distance is covered by dice and
                    (this.data.game.board[cellId].color !== (this.data.game.turn+1) % 2 || //color isn't opponent's or
                    this.data.game.board[cellId].count === 1)) { //there's only one piece
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

    renderCellTop(cell, key) {
        cell.state = this.getCellState(cell.id);
        return (
            <div className="column" key={key}>
                <Cell cellData={cell} clickHandler={this.cellClickHandler} />
            </div>
        );
    },

    renderCellBottom(cell, key) {
        cell.state = this.getCellState(cell.id);
        return (
            <div className="column" key={key}>
                <Cell cellData={cell} clickHandler={this.cellClickHandler} isBottom='true' />
            </div>
        );
    },

    render() {
        //if user isn't part of the game
        if (this.data.game.players.indexOf(this.data.userId) === -1) {
            return null;
        }

        if (this.data.game.players.length < 2) {
            return (
                <div className="ui active text loader">
                    Waiting for opponent.
                </div>
            );
        }

        return (
            <div className="ui text container">

                <div className="ui fourteen column centered grid board-image">
                    {this.topLeftRow().map(this.renderCellTop)}
                    <div className="ui two wide column"/>
                    {this.topRightRow().map(this.renderCellTop)}
                    {this.bottomLeftRow().map(this.renderCellBottom)}
                    <div className="ui two wide column"/>
                    {this.bottomRightRow().map(this.renderCellBottom)}
                </div>

                <div className="ui centered grid">
                    <div className="row">
                        <div className="column">Player</div>
                        <div className="column">Dice</div>
                        <div className="column">Turn</div>
                        <div className="column">Broken</div>
                    </div>
                    <div className="row">
                        <div className="column">
                            <div className={'ui ' + (this.data.game.players.indexOf(this.data.userId) ? 'purple' : 'blue') + ' label'}>
                                {this.data.game.players.indexOf(this.data.userId)}
                            </div>
                        </div>
                        <div className="column">
                            {this.data.game.dice.toString()}
                        </div>
                        <div className="column">
                            <div className={'ui ' + (this.data.game.turn % 2 ? 'purple' : 'blue') + ' label'}>
                                {this.data.game.turn}
                            </div>
                        </div>
                        <div className="column">
                            <Broken color={0} count={this.data.game.broken[0]} />
                            <Broken color={1} count={this.data.game.broken[1]} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
