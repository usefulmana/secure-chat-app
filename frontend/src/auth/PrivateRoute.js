import React, { Component } from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import { isAuthenticated, currentUser } from "../API/userAPI";

const PrivateRoute = ({ history, component, ...rest }) => {

    if (!isAuthenticated) {
        history.push('/no/access')
        window.location.reload()
    }

    currentUser().then((data) => {
        if (data === null || data===undefined) {
            localStorage.removeItem('jwt')
            history.push('/')
            window.location.reload()
        }
    }).catch()


    return isAuthenticated() ?
        <Route {...rest} component={component} /> : <Redirect to={'/'} />
};

export default withRouter(PrivateRoute);
