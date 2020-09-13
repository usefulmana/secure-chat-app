import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, Link, withRouter } from "react-router-dom";
import { editChannel, deleteChannel } from '../../API/channelAPI'
import EditChannelForm from './EditChannelForm'
import Modal from '../../Template/Modal'
import querySearch from "stringquery";

import channel from './Channel.scss'
import socketClient from "../../Socket/clinet"

const ChannelContent = ({ history }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));

    const [currentChannelId, setCurrentChannelId] = useState()
    const [userId, setUserId] = useState()

    const initCurrentChannelId = (channels) => {
        var channelId = querySearch(history.location.search).channel;
        setCurrentChannelId(channelId)
    }

    useEffect(() => {

        socketClient.socket.on("test",()=>{
            alert("in channel content")
        })

        setUserId(jwt.user._id)
        initCurrentChannelId()
    }, [querySearch(history.location.search).channel])

    const handleSubmit = () => {
        var message = "hello from the other side"
        socketClient.createNewMessge({ channelId: currentChannelId, userId, message })
    }

    return (
        <div  >
            {currentChannelId}
            <div onClick={handleSubmit}>send message</div>
        </div>

    )
}

export default withRouter(ChannelContent)