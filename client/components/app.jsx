App = React.createClass({
    render() {
        return (
            <div>
                {/*<header class="navbar navbar-default" role="navigation">
                    <div class="navbar-header">
                        <a class="navbar-brand" href="/">Tavla</a>
                    </div>
                </header>*/}

                {this.props.content}
            </div>
        );
    }
});
