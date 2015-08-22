FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "landingPage"});
  }
});

FlowRouter.route('/:gameId', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "board"});
  }
});