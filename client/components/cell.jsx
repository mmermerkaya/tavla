Cell = React.createClass({
    clickHandler(event) {
        this.props.clickHandler(this.props.cellData.id);
    },

    getColor() {
        switch (this.props.cellData.state) {
            case 'selected':
                return 'red';
            case 'moveable':
                return 'green';
            case 'idle':
                switch (this.props.cellData.color) {
                    case -1:
                        return 'transparent';
                    case 0:
                        return 'blue';
                    case 1:
                        return 'purple';
                }
        }
        return 'black';
    },

    render() {
        var style = {
            color: this.getColor()
        };

        var content = [];
        for (var i = this.props.cellData.count; i > 0; i--) {
            content.push(<span><i className="fa fa-dot-circle-o fa-3x" /><br /></span>);
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
