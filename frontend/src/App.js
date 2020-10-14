import React from 'react';
import './Template/GlobalCSS/myBootstrap.scss';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

// Import core components
import Main from './core/Main/Main';
import Profile from "./core/Profile/Profile";
import PrivateRoute from "./auth/PrivateRoute";
import TeamsList from './core/TeamsList/TeamsList';
import Team from './core/Team/Team';
import DmPage from './core/Dm/DmPage';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Main} />
        <PrivateRoute path="/teams" exact component={TeamsList} />
        <PrivateRoute path="/team/:teamId/:channelId" exact component={Team} />
        <PrivateRoute path="/dm/:channelId" exact component={DmPage} />
        
        <PrivateRoute path="/profile/" exact component={Profile} />
    
      </Switch>
    </BrowserRouter>
  );
}

export default App;
