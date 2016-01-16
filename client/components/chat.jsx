Chat = React.createClass({
    render() {
        return (
            <div className="chatbox panel panel-primary">
                <div className="panel-heading">
                    <i className="fa fa-comment"/> Chat
                </div>
                <div className="panel-body">
                    <ul className="chat">
                        <li className="clearfix">
                            <div className="chat-body clearfix">
                                <div className="header">
                                    <strong className="primary-font">
                                        <i className="fa fa-user text-primary"/>Player 1
                                    </strong>
                                    <small className="pull-right text-muted">
                                        <i className="fa fa-clock-o"/>12 mins ago
                                    </small>
                                </div>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare
                                    dolor, quis ullamcorper ligula sodales.
                                </p>
                            </div>
                        </li>
                        <li className="clearfix">
                            <div className="chat-body clearfix">
                                <div className="header">
                                    <strong className="primary-font">
                                        <i className="fa fa-user text-danger"/>Player 2
                                    </strong>
                                    <small className="pull-right text-muted">
                                        <i className="fa fa-clock-o"/>12 mins ago
                                    </small>
                                </div>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare
                                    dolor, quis ullamcorper ligula sodales.
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="panel-footer">
                    <div className="input-group">
                        <input id="btn-input" type="text" className="form-control input-sm" placeholder="Type your message here..." />
                        <span className="input-group-btn">
                            <button className="btn btn-warning btn-sm" id="btn-chat">
                                Send
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
});
