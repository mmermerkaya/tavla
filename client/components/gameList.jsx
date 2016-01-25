GameList = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        var handle = Meteor.subscribe('gameList');

        return {
            ready: handle.ready(),
            gameList: Games.find({})
        };
    },

    render: function() {
        if (!this.data.ready) {
            return <SpinnerWrapper title={'Loading Game List'} />;
        }

        return (
            <div className="container">
                <table className="table">
                    <thead>
                        <tr>
                            <td>Id</td>
                            <td>Status</td>
                            <td>Join Game</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.data.gameList.map(function(game) {
                            return (
                                <tr>
                                    <td>{game._id}</td>
                                    <td>{game.status()}</td>
                                    <td>
                                        <a className="btn btn-primary" href={'/game/' + game._id}>
                                            Join Game
                                        </a>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
});
