Broken = React.createClass({
	render() {
		var content = [];
        for (var i = this.props.data.count; i > 0; i--) {
            content.push(<span>X<br /></span>);
        };

        return (
        	<div className={'ui label'}>
        		{content}
        	</div>
        );
	}
});