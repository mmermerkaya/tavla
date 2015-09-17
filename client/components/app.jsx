App = React.createClass({
    render() {
        return (
            <div className="ui container">
                <div className="ui menu">
                    <div className="header item">
                        Tavla
                    </div>
                </div>

                {this.props.content}
            </div>
        );
    }
});
