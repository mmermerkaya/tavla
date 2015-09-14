Cell = React.createClass({
    clickHandler(event) {
        this.props.clickHandler(this.props.cellData.id);
    },

    render() {
        var className = "cell " + this.props.cssClass;

        return (
            <div className={className} onClick={this.clickHandler}>
                {this.props.cellData.id}
                <br/>
                {this.props.cellData.color} {this.props.cellData.count}
            </div>
        )
    }
});
