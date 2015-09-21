Board = React.createClass({
    // This mixin makes the getMeteorData method work
    mixins: [ReactMeteorData],

    // Loads items from the Tasks collection and puts them on this.data.tasks
    getMeteorData() {
        return {
            game: Games.findOne({_id: FlowRouter.getParam('gameId')})
        }
    },

    getInitialState() {
        return {
            selected: null,
            moveable: []
        };
    },

    topLeftRow() {
        return this.data.game.board.slice(12, 18);
    },

    topRightRow() {
        return this.data.game.board.slice(18, 24);
    },

    bottomLeftRow() {
        return this.data.game.board.slice(6, 12).reverse();
    },

    bottomRightRow() {
        return this.data.game.board.slice(0, 6).reverse();
    },

    cellClickHandler(cellId) {
        console.log(cellId);

        //If player can move
        if (this.data.game.broken[this.data.game.turn % 2] === 0) {
            //If player clicked on an idle cell
            if (this.getCellState(cellId) === 'idle') {
                if (this.data.game.board[cellId].color === this.data.game.turn % 2) {
                    console.log('selected ' + cellId);
                    var moveable = [];
                    var dir = this.data.game.turn % 2 ? 1: -1;
                    this.data.game.dice.forEach(function(die) {
                        var targetCell = cellId + (die * dir);
                        if (targetCell >= 0 && targetCell < 24 &&
                            (this.data.game.board[targetCell].color !== (this.data.game.turn+1) % 2 ||
                                (this.data.game.board[targetCell].color === (this.data.game.turn+1) % 2 &&
                                this.data.game.board[targetCell].count === 1))) {
                            moveable.push(targetCell);
                        }
                    }.bind(this));

                    this.setState({
                        selected: cellId,
                        moveable: moveable
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
                    Meteor.call('movePiece', FlowRouter.getParam('gameId'), this.state.selected, cellId);
                }
                this.deselect();
            }
        }
        //if player has broken pieces
        else {

        }
    },

    deselect() {
        this.setState({
            selected: null,
            moveable: []
        });
    },

    getCellState(cellId) {
        if(cellId === this.state.selected) {
            return 'selected';
        }
        else if (this.state.moveable.indexOf(cellId) !== -1) {
            return 'moveable';
        }
        else {
            return 'idle';
        }
    },

    renderCell(cell) {
        cell.state = this.getCellState(cell.id);
        return (
            <div className="column" key={cell.id}>
                <Cell cellData={cell} clickHandler={this.cellClickHandler} />
            </div>
        );
    },

    render() {
        return (
            <div className="ui text container">
                <div className="ui twelve column centered grid">
                    {this.topLeftRow().map(this.renderCell)}
                    {this.topRightRow().map(this.renderCell)}
                    {this.bottomLeftRow().map(this.renderCell)}
                    {this.bottomRightRow().map(this.renderCell)}
                </div>
                Dice: {this.data.game.dice.toString()}
                <br />
                Turn: {this.data.game.turn}
                <br />
                Broken 0: <Broken color={0} count={this.data.game.broken[0]} />
                Broken 1: <Broken color={1} count={this.data.game.broken[1]} />
            </div>
        );
    }
});
