Game = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        var data = {
            ready: false
        };

        var handle = Meteor.subscribe('game', FlowRouter.getParam('gameId'));

        if (handle.ready()) {
            data.ready = true;
        }

        return data;
    },

    render() {
        if (!this.data.ready) {
            return <SpinnerWrapper title={'Loading Game'} body={'This won\'t take long...'} />;
        }

        return (
            <div className="container">
                <Board gameId={FlowRouter.getParam('gameId')} />
            </div>
        );
    }
});
