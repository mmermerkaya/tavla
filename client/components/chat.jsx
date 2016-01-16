Chat = React.createClass({
    sendMessage() {
        Meteor.call('sendMessage', this.props.game._id, this.refs.messageText.value);
        this.refs.messageText.value = '';
    },

    render() {
        var messages = _.map(this.props.game.messages, function messageContent(message) {
            return (
                <li className="clearfix">
                    <div className="chat-body clearfix">
                        <div className="header">
                            <strong className="primary-font">
                                <i className="fa fa-user text-primary"/>
                                Player {this.props.game.player(message.from) + 1}
                            </strong>
                            <small className="pull-right text-muted">
                                <i className="fa fa-clock-o"/>12 mins ago
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
                <div className="panel-body">
                    <ul className="chat">
                        {messages}
                    </ul>
                </div>
                <div className="panel-footer">
                    <div className="input-group">
                        <input id="btn-input" type="text"
                            className="form-control input-sm"
                            placeholder="Type your message here..."
                            ref="messageText" />
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
