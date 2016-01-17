Chat = React.createClass({
    getPlayerValues(userId) {
        switch (this.props.game.player(userId)) {
        case 0:
            return {name: 'Player 1', color: 'text-primary'};
        case 1:
            return {name: 'Player 2', color: 'text-danger'};
        default:
            return {name: 'Spectator', color: 'text-warning'};
        }
    },

    sendMessage() {
        if (this.refs.messageText.value !== '') {
            Meteor.call('sendMessage', this.props.game._id, this.refs.messageText.value);
            this.refs.messageText.value = '';
        }
    },

    componentDidUpdate(prevProps/* , prevState */) {
        if (prevProps.game.messages.length < this.props.game.messages.length) {
            var element = document.getElementById('messageList');
            element.scrollTop = element.scrollHeight;
        }
    },

    onKeyUp(e) {
        if (e.key === "Enter") {
            this.sendMessage();
        }
    },

    render() {
        var messages = _.map(this.props.game.messages, function messageContent(message, i) {
            var player = this.getPlayerValues(message.from);
            return (
                <li className="clearfix" key={i}>
                    <div className="chat-body clearfix">
                        <div className="header">
                            <strong className="primary-font">
                                <i className={"fa fa-user " + player.color} />
                                {player.name}
                            </strong>
                            <small className="pull-right text-muted">
                                <i className="fa fa-clock-o"/>{moment(message.time).format('HH:mm')}
                            </small>
                        </div>
                        <p>{message.text}</p>
                    </div>
                </li>
            );
        }.bind(this));

        return (
            <div className="chatbox panel panel-primary">
                <div className="panel-heading">
                    <i className="fa fa-comment"/> Chat
                </div>
                <div className="panel-body" id="messageList">
                    <ul className="chat">
                        {messages}
                    </ul>
                </div>
                <div className="panel-footer">
                    <div className="input-group">
                        <input id="btn-input" type="text"
                            maxLength="1000"
                            className="form-control input-sm"
                            placeholder="Type your message here..."
                            ref="messageText"
                            onKeyUp={this.onKeyUp} />
                        <span className="input-group-btn">
                            <button className="btn btn-warning btn-sm" id="btn-chat" onClick={this.sendMessage}>
                                Send
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
});
