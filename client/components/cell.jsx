Cell = React.createClass({
/*
    cssClass() {
        if (this.data.id == Session.get('selected')) {
            return 'selected';
        }

        if (Session.get('selected') !== null) {
            var board = Games.findOne({_id: FlowRouter.getParam('gameId')});
            var dir = board.turn % 2 ? 1: -1;
            if (board.dice.indexOf((this.id * -dir) + (Session.get('selected') * dir)) !== -1) {
                return 'moveable';
            }
        }
        return 'idle';
    },

    'click .idle': function idle(event) {
      console.log('selected ' + this.id);
      Session.set('selected', this.id);
    },

    'click .selected': function selected(event) {
      console.log('deselected ' + this.id);
      Session.set('selected', null);
    },

    'click .moveable': function available(event) {
      console.log('moving ' + Session.get('selected') + ' to ' + this.id);
      Meteor.call('movePiece', FlowRouter.getParam('gameId'), Session.get('selected'), this.id);
      Session.set('selected', null);
    }
*/
    render() {
        return (
            <div className="cell">
                {this.props.cellData.id}
                <br/>
                {this.props.cellData.color} {this.props.cellData.count}
            </div>
        )
    }
});
