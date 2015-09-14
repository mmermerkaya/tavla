Meteor.startup(function () {
    Session.set('selected', null);
    React.render(<App />, document.getElementById("main"));
});
