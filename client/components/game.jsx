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
        return this.data.ready ? <Board gameId={FlowRouter.getParam('gameId')} /> : <SpinnerWrapper title='Loading Game' />;
    }
});
