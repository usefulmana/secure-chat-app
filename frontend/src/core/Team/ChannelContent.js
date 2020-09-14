import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, Link, withRouter } from "react-router-dom";
import { getChannelInfo } from '../../API/channelAPI'
import { getMessageFromChannel } from '../../API/chatAPI'
import querySearch from "stringquery";

import channelContent from './ChannelContent.scss'
import socketClient from "../../Socket/clinet"
import handleAccess from './handleAccess'

const ChannelContent = ({ history }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));

    const [userId, setUserId]= useState()
    const [currentChannelId, setCurrentChannelId] = useState()
    const [channelInfo, setChannelInfo] = useState()
    const [newMessage, setNewMessage] = useState()
    const [messages, setMessages] = useState({})
    const [access, setAccess] = useState(handleAccess())



    useEffect(() => {
        var channelId = initCurrentChannelId()

        getChannelInfo({ channelId }).then((data) => {
            console.log("Data in get channel info : ", data)
            setChannelInfo(data)
            console.log("handleAccess(data) : ", handleAccess(data))
            setAccess(handleAccess(data))
        }).catch()

        getMessage(channelId)
        setUserId(jwt.user._id)
        socketInit(channelId)

    }, [querySearch(history.location.search).channel])

    const socketInit = (channelId) => {
        socketClient.joinChannel(channelId)
        socketClient.listenToChannel(() => { getMessage(channelId) })
    }

    const initCurrentChannelId = (channels) => {
        var channelId = querySearch(history.location.search).channel;
        setCurrentChannelId(channelId)
        return channelId
    }

    const getMessage = (channelId) => {
        getMessageFromChannel({ channelId }).then((data) => {
            if (data.error) {
            } else {
                setMessages(data)
                console.log("data in get meesage from channel :", data)
                scrollToBottom()
            }
        })
    }

    /*=========================================
                    Init code above
    ==========================================*/
    const scrollToBottom = () => {
        var contentCont = document.querySelector(".content-cont")
        if(contentCont) contentCont.scrollTo(0, contentCont.scrollHeight)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("currentChannelId : ", currentChannelId)
        socketClient.createNewMessge({ channelId: currentChannelId, userId, message: newMessage })
        // getMessage(currentChannelId)
    }

    const renderMessages = () => {
        return messages?.docs?.map(m =>
            <div className="each-message">
                {m._id}
                {m.message}
            </div>
        )
    }

    const showNewMessageForm = () => {
        return (
            <form className="form-cont" onSubmit={handleSubmit} >
                <input placeholder="Start new chat!" className="" value={newMessage} onChange={(e) => { setNewMessage(e.target.value) }} />
            </form>
        )
    }

    return access&&(
        <div className="channel-content-cont">
            <div className="content-cont">
                {/* {currentChannelId} */}
                {renderMessages()}
            </div>
            <div className="new-message-cont ">
                {showNewMessageForm()}
            </div>
        </div>

    )
}

export default withRouter(ChannelContent)