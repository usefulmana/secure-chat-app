import React from 'react';
import './GlobalCSS/myBootstrap.scss';
import './GlobalCSS/responsive.scss';
import Main from './core/Main';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import Dashboard from "./core/Dashboard";
import Profile from "./core/Profile";
import PrivateRoute from "./auth/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Main} />

        <PrivateRoute path="/dashboard/" exact component={Dashboard} />
        <PrivateRoute path="/profile/" exact component={Profile} />
        {/* <PrivateRoute path="/dashboard/locations" exact component={LocationPage} /> */}
        {/* <AdminRoute path="/dashboard/users" exact component={UserMg} /> */}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
