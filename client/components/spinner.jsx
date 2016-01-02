SpinnerWrapper = React.createClass({
    render: function() {
        return (
            <div className="spinner">
                <h2>{this.props.title}</h2>
                <SpinnerView />
            </div>
        );
    }
});
