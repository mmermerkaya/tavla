Reaktor.init(
    <Router>
      <Route path="/" layout={App} content={LandingPage} />
      <Route path="/game/:gameId" layout={App} content={Board} />
    </Router>
);
