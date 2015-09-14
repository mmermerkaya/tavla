Board = React.createClass({
    // This mixin makes the getMeteorData method work
    mixins: [ReactMeteorData],

    // Loads items from the Tasks collection and puts them on this.data.tasks
    getMeteorData() {
        return {
            game: Games.findOne({_id: FlowRouter.getParam('gameId')})
        }
    },

    topRow: function() {
        return this.data.game.board.slice(12, 24);
    },

    bottomRow: function() {
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
        return (<Cell cellData={cell} cssClass={cssClass} key={cell.id} clickHandler={this.cellClickHandler} />);
    },

    render() {
        var topRow = this.topRow();
        var bottomRow = this.bottomRow();

        return (
            <div className="board">
                <div className="row top">
                    {topRow.map(this.renderCell)}
                </div>
                <div className="row bottom">
                    {bottomRow.map(this.renderCell)}
                </div>
                {this.data.game.dice}
                {this.data.game.turn}
            </div>
        );
    }
});
