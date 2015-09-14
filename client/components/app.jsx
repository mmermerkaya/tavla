const {
    AppBar
} = mui;

const ThemeManager = new mui.Styles.ThemeManager();

App = React.createClass({
    childContextTypes: {
        muiTheme: React.PropTypes.object
    },

    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },

    render() {
        return (
            <div>
                {/*
                    <header class="navbar navbar-default" role="navigation">
                    <div class="navbar-header">
                    <a class="navbar-brand" href="/">Tavla</a>
                    </div>
                    </header>
                */}
                <AppBar title="Tavla" />

                {this.props.content()}
            </div>
        );
    }
});
