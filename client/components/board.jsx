Board = React.createClass({
    // This mixin makes the getMeteorData method work
    mixins: [ReactMeteorData],

    // Loads items from the Tasks collection and puts them on this.data.tasks
    getMeteorData() {
        return {
            game: Games.findOne({_id: FlowRouter.getParam('gameId')})
        }
    },

    topRow() {
        return this.data.game.board.slice(12, 24);
    },

    bottomRow() {
        return this.data.game.board.slice(0, 12).reverse();
    },

    //TODO: calculate this during data retrieval and keep it in a React state.
    cssClass(cellId) {
        if (cellId == Session.get('selected')) {
            return 'selected';
        }

        if (Session.get('selected') !== null) {
            var dir = this.data.game.turn % 2 ? 1: -1;
            if (this.data.game.dice.indexOf((cellId * -dir) + (Session.get('selected') * dir)) !== -1) {
                return 'moveable';
            }
        }

        return 'idle';
    },

    cellClickHandler(cellId) {
        console.log(cellId);
        if (this.cssClass(cellId) === 'idle') {
            console.log('selected ' + cellId);
            Session.set('selected', cellId);
        }
        else if (this.cssClass(cellId) === 'selected') {
            console.log('deselected ' + cellId);
            Session.set('selected', null);
        }
        else if (this.cssClass(cellId) === 'moveable') {
            console.log('moving ' + Session.get('selected') + ' to ' + cellId);
            Meteor.call('movePiece', FlowRouter.getParam('gameId'), Session.get('selected'), cellId);
            Session.set('selected', null);
        }

        //TODO: Remove forceUpdate. Put cell state information (idle/selected/moveable) in a React state.
        this.forceUpdate();
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
            </div>
        );
    }
});
