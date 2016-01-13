SpinnerWrapper = React.createClass({
    render: function() {
        return (
            <div className="spinner-wrapper">
                <h2>{this.props.title}</h2>
                <h4>{this.props.body}</h4>
                <div className="spinner-view">
                    <SpinnerView />
                </div>
            </div>
        );
    }
});
