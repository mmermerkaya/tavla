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

    render() {
        var topRow = this.topRow();
        var bottomRow = this.bottomRow();
        console.log(topRow);
        return (
            <div className="board">
              <div className="row top">
                  {topRow.map(function(cell) {
                      return (<Cell cellData={cell} key={cell.id} />);
                  })}
              </div>
              <div className="row bottom">
                  {bottomRow.map(function(cell) {
                      return (<Cell cellData={cell} key={cell.id} />);
                  })}
              </div>
              {this.data.game.dice}
              {this.data.game.turn}
            </div>
        );
    }
});
