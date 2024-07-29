// App.jsx
// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { SignIn } from "./frontend/SignIn/SignIn";
//import UserProfile from './frontend/UserProfile/';
function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={SignIn} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
