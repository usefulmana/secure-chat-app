import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, Link, withRouter } from "react-router-dom";
import { editChannel, deleteChannel } from '../../API/channelAPI'
import Modal from '../../Template/Modal'
import { isUserHasAccessToThisChannel } from './handleAccess'
import AddMemberToPrivate from "../Common/AddMemberToPrivate";
import channel from "./Channel.scss"
import socketClient from '../../Socket/clinet'

const Channel = ({ history, match, teamInfo, channel, isAdmin }) => {


    return (
        <div>
            awef
        </div>
    )
}

export default withRouter(Channel)