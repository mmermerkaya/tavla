Cell = React.createClass({
    clickHandler(event) {
        this.props.clickHandler(this.props.cellData.id);
    },

    getColor() {
        switch (this.props.cssClass) {
            case 'selected':
                return 'red';
            case 'moveable':
                return 'green';
            case 'idle':
                switch (this.props.cellData.color) {
                    case -1:
                        return 'white';
                    case 0:
                        return 'blue';
                    case 1:
                        return 'purple';
                }
        }
        return 'black';
    },

    render() {
        var className = 'ui ' + this.getColor() + ' label';

        return (
            <div className={className} onClick={this.clickHandler}>
                {this.props.cellData.count}
            </div>
        )
    }
});
