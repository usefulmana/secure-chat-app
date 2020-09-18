import React from 'react';
import './Template/GlobalCSS/myBootstrap.scss';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

// Import core components
import Main from './core/Main/Main';
import Dashboard from "./core/Dashboard/Dashboard";
import Profile from "./core/Profile/Profile";
import PrivateRoute from "./auth/PrivateRoute";
import TeamsList from './core/TeamsList/TeamsList';
import Team from './core/Team/Team';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Main} />

        {/* <PrivateRoute path="/dashboard/" exact component={Dashboard} /> */}
        <PrivateRoute path="/teams" exact component={TeamsList} />
        {/* <PrivateRoute path="/dashboard/teams/:id" exact component={Dashboard} /> */}
        <PrivateRoute path="/team/:teamId/:channelId" exact component={Team} />
        {/* <PrivateRoute path="/team/:teamId" exact component={Team} /> */}
        <PrivateRoute path="/profile/" exact component={Profile} />
        {/* <PrivateRoute path="/dashboard/locations" exact component={LocationPage} /> */}
        {/* <AdminRoute path="/dashboard/users" exact component={UserMg} /> */}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
