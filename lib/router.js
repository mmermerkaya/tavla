FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "landingPage"});
  }
});

FlowRouter.route('/game/:gameId', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "board"});
  }
});