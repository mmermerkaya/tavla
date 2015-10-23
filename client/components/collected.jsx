Collected = React.createClass({
    clickHandler(event) {
        this.props.clickHandler(this.props.color);
    },

    getColor() {
        switch (this.props.state) {
            case 'moveable':
                return 'green';
            case 'idle':
                switch (this.props.color) {
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

        var content = [];
        for (var i = this.props.count; i > 0; i--) {
            content.push(<span key={i}>X<br /></span>);
        };

        return (
            <div className={className} onClick={this.clickHandler}>
                {content}
            </div>
        )
    }
});
