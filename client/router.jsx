Reaktor.init(
    <Router>
      <Route path="/" layout={App} content={LandingPage} name="Home" />
      <Route path="/about" layout={App} content={About} name="About" />
      <Route path="/game/:gameId" layout={App} content={Game} name="Game" />
    </Router>
);
