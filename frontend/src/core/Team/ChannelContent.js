import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, Link, withRouter } from "react-router-dom";
import { getChannelInfo } from '../../API/channelAPI'
import { getMessageFromChannel } from '../../API/chatAPI'
import querySearch from "stringquery";
import Chat from "../Common/Chat"
import channelContent from './ChannelContent.scss'
import socketClient from "../../Socket/clinet"
import { isUserHasAccessToThisChannel } from './handleAccess'

const ChannelContent = ({ history, match }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    const userId = jwt.user._id
    const [currentChannelId, setCurrentChannelId] = useState()
    const [channelInfo, setChannelInfo] = useState()
    const [newMessage, setNewMessage] = useState()
    const [messages, setMessages] = useState({})
    const [access, setAccess] = useState()



    useEffect(() => {
        var channelId = initCurrentChannelId()

        getChannelInfo({ channelId }).then((data) => {
            console.log("Data in get channel info : ", data)

            setChannelInfo(data)
            setAccess(isUserHasAccessToThisChannel(data))
            setCurrentChannelId(channelId)
            getMessage(channelId)
            socketInit(channelId)

        }).catch()


    }, [match.params.channelId])

    const socketInit = (channelId) => {
        console.log("listenint to : ", JSON.stringify(channelId))
        socketClient.joinChannel(channelId, (updatedChannelId) => {
              

                
            if (updatedChannelId === match.params.channelId) {
                getMessage(updatedChannelId)
            }
        })
    }

    const initCurrentChannelId = (channels) => {
        console.log("param : ", match.params.channelId)
        var channelId = match.params.channelId;
        // var channelId = querySearch(history.location.search).channel;
        return channelId
    }

    const getMessage = (channelId) => {
        console.log("updated channel id : ", channelId)
        console.log("currentChannleid : ", match.params.channelId)
        getMessageFromChannel({ channelId }).then((data) => {
            if (data?.error) {
            } else {
                setMessages(data)
                console.log("data in get message from channel :", data)
                console.log("match.params.channelId:", match.params.channelId)
                scrollToBottom()
            }
        })
    }

    /*=========================================
                    Init code above
    ==========================================*/
    const scrollToBottom = () => {
        var contentCont = document.querySelector(".content-cont")
        if (contentCont) contentCont.scrollTo(0, contentCont.scrollHeight)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        socketClient.createNewMessge({ channelId: currentChannelId, userId, message: newMessage })
        // getMessage(currentChannelId)
        setNewMessage("")
    }


    const renderMessages = () => {
        return messages?.docs?.map((m, index) => {
            var previousIndex = 0
            if (index === 0) {
                previousIndex = 0
            } else {
                previousIndex = index - 1
            }

            return <Chat message={m} previousChatUser={messages.docs[previousIndex].user.email} index={index} />
        }
        )
    }

    const showNewMessageForm = () => {
        return (
            <form className="form-cont" onSubmit={handleSubmit} >
                <input placeholder="Start new chat!" className="" value={newMessage} onChange={(e) => { setNewMessage(e.target.value) }} />
            </form>
        )
    }

    return access ? (
        <div className="channel-content-cont">
            <div className="content-cont">
                {/* {currentChannelId} */}
                {renderMessages()}
            </div>
            <div className="new-message-cont ">
                {showNewMessageForm()}
            </div>
        </div>
    ) : <></>
}

export default withRouter(ChannelContent)