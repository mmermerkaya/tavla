Cell = React.createClass({
    clickHandler(event) {
        this.props.clickHandler(this.props.cellData.id);
    },

    render() {
        var style = {
            color: GetColor(this.props.cellData.state, this.props.cellData.color)
        };

        var content = [];
        for (var i = this.props.cellData.count; i > 0; i--) {
            content.push(<span key={i}><i className="fa fa-dot-circle-o fa-3x" /><br /></span>);
        };

        if (!this.props.cellData.count) {
            content = <i className="fa fa-times fa-3x" />;
        }

        return (
            <div style={style} onClick={this.clickHandler}>
                {content}
            </div>
        )
    }
});
