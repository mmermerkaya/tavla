Meteor.startup(function () {
    Session.set('selected', null);
    injectTapEventPlugin();
    //React.render(<App />, document.getElementById("container"));
});
