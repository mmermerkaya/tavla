App = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        return {
            userId: Meteor.userId()
        };
    },

    render() {
        var content;
        if (this.data && this.data.userId) {
            content = this.props.content;
        } else {
            content = <SpinnerWrapper title={'Loading Application'} />;
        }

        return (
            <div className="wrapper">
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div className="container">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" href="/">Tavla</a>
                        </div>
                        <div className="navbar-collapse collapse" id="navbar">
                            <ul className="nav navbar-nav">
                                <li className={FlowRouter.getRouteName() === "Home" ? "active" : ""}>
                                    <a href="/">Home</a>
                                </li>
                                <li className={FlowRouter.getRouteName() === "About" ? "active" : ""}>
                                    <a href="/about">About</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                {content}

                <footer className="footer">
                    <div className="container">
                        <p className="text-muted">
                            <a href="https://www.github.com/mmermerkaya">Creator</a> | <a href="https://www.github.com/mmermerkaya/tavla">Source Code</a> | <a href="https://github.com/mmermerkaya/tavla/blob/master/LICENSE.md">License</a>
                        </p>
                    </div>
                </footer>
            </div>
        );
    }
});
