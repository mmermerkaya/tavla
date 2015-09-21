Broken = React.createClass({
    render() {
        var className = 'ui ' + (this.props.color ? 'purple' : 'blue') + ' label';

        var content = [];
        for (var i = this.props.count; i > 0; i--) {
            content.push(<span>X<br /></span>);
        };

        return (
            <div className={className}>
                {content}
            </div>
        );
    }
});