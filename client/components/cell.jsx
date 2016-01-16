Cell = React.createClass({
    clickHandler() {
        if (this.props.clickHandler) {
            this.props.clickHandler(this.props.cellData.id);
        }
    },

    render() {
        var style = {
            color: getColor(this.props.cellData.state, this.props.cellData.color)
        };

        var content = _.map(_.range(this.props.cellData.count), function(i) {
            return <span key={i}><i className="fa fa-dot-circle-o fa-3x"/><br /></span>;
        });

        if (!this.props.cellData.count && this.props.cellData.color === -1) {
            content = <i className="fa fa-times fa-3x"/>;
        }

        return (
            <div style={style} onClick={this.clickHandler}>
                {content}
            </div>
        );
    }
});
