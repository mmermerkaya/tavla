App = React.createClass({
    render() {
        return (
            <div className="ui container">
                {/*
                    <header class="navbar navbar-default" role="navigation">
                    <div class="navbar-header">
                    <a class="navbar-brand" href="/">Tavla</a>
                    </div>
                    </header>
                */}
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
