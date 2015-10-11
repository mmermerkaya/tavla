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
        var className = 'circular ui large ' + this.getColor() + ' label';
        if(this.props.isBottom){
            className += ' section-bottom';
        }

        var content = [];
        for (var i = this.props.cellData.count; i > 0; i--) {
            content.push(<span key={i}>X<br /></span>);
        };

        return (
            <div className={className} onClick={this.clickHandler}>
                {content}
            </div>
        )
    }
});
