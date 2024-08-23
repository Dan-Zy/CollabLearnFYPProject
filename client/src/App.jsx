// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SignIn } from "./frontend/SignIn/SignIn";

function App() {
  return (
    <div>
      <ToastContainer /> {/* Properly placed ToastContainer */}
      <Router>
        <Switch>
          <Route exact path="/" component={SignIn} />
          {/* Add other routes here */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
