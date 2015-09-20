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

    topRow() {
        return this.data.game.board.slice(12, 24);
    },

    bottomRow() {
        return this.data.game.board.slice(0, 12).reverse();
    },

    cellClickHandler(cellId) {
        console.log(cellId);

        if (this.cssClass(cellId) === 'idle') {
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
            else if(this.state.selected !== null) {
                console.log('deselected ' + this.state.selected);
                this.deselect();
            }
        }
        else if (this.cssClass(cellId) === 'selected') {
            console.log('deselected ' + cellId);
            this.deselect();
        }
        else if (this.cssClass(cellId) === 'moveable') {
            console.log('moving ' + this.state.selected + ' to ' + cellId);
            Meteor.call('movePiece', FlowRouter.getParam('gameId'), this.state.selected, cellId);
            this.deselect();
        }
    },

    deselect() {
        this.setState({
            selected: null,
            moveable: []
        });
    },

    cssClass(cellId) {
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
        var cssClass = this.cssClass(cell.id);
        return (
            <div className="column" key={cell.id}>
                <Cell cellData={cell} cssClass={cssClass} clickHandler={this.cellClickHandler} />
            </div>
        );
    },

    render() {
        var topRow = this.topRow();
        var bottomRow = this.bottomRow();

        return (
            <div className="ui text container">
                <div className="ui twelve column centered grid">
                    {topRow.map(this.renderCell)}
                    {bottomRow.map(this.renderCell)}
                </div>
                Dice: {this.data.game.dice.toString()}
                <br />
                Turn: {this.data.game.turn}
                <br />
                Broken: <Broken data={this.data.game.broken}/>
            </div>
        );
    }
});
