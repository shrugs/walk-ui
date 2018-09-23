import React from "react";
import { Provider as StoreProvider } from "mobx-react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { injectGlobal } from "styled-components";

import store from "./store";

import NoMatch from "./screens/NoMatch";

import Index from "./screens/Index";
import ShowProfile from "./screens/ShowProfile";
import ShowTrip from "./screens/ShowTrip";

injectGlobal`
  body {
    margin: 0;
  }

  .mapboxgl-ctrl-logo {
    display: none !important;
  }
`;

const App = () => (
  <StoreProvider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={Index} />
        <Route path="/:handle">
          <Switch>
            <Route path="/:handle/trip/:tripHandle" component={ShowTrip} />
            <Route component={ShowProfile} />
          </Switch>
        </Route>
        <Route component={NoMatch} />
      </Switch>
    </Router>
  </StoreProvider>
);

export default App;
