import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, Link, withRouter } from "react-router-dom";
import { getChannelInfo } from '../../API/channelAPI'
import { getMessageFromChannel } from '../../API/chatAPI'
import querySearch from "stringquery";
import Chat from "../Common/Chat"
import './ChannelContent.scss'
import socketClient from "../../Socket/clinet"
import { isUserHasAccessToThisChannel } from './handleAccess'
import Input from "./Input";
import Draggable from "react-draggable";
import { TweenLite } from 'gsap'
import LiveChannel from "./LiveChannel";
import Loader from "../Common/Loader"

const ChannelContent = ({ history, match }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    const userId = jwt.user._id
    const [currentChannelId, setCurrentChannelId] = useState()
    const [channelInfo, setChannelInfo] = useState()
    const [newMessage, setNewMessage] = useState()
    const [messages, setMessages] = useState({})
    const [access, setAccess] = useState()
    const [liveChatPopUp, setLiveChatPopUp] = useState(false)
    const [maximized, setMaximized] = useState(true)
    const [loading, setLoading] = useState(true)

    const [channelOnCall, setChannelOnCall] = useState(false)

    useEffect(() => {
        setLoading(true)
        var channelId = initCurrentChannelId()
        setChannelOnCall(false)
        getChannelInfo({ channelId }).then((data) => {
            setChannelInfo(data)
            setAccess(isUserHasAccessToThisChannel(data))
            setCurrentChannelId(channelId)
            getMessage(channelId)
            socketInit(channelId)
        }).catch()


    }, [match.params.channelId])

    const socketInit = (channelId) => {
        socketClient.joinChannel(channelId, (updatedChannelId) => {
            if (updatedChannelId === match.params.channelId) {
                getMessage(updatedChannelId)
            }
        })

        socketClient.isChannelOnCall(channelId, (isOnline) => {
            if (isOnline) setChannelOnCall(true)
        })

        socketClient.listenChannelCall(channelId, () => {
            setChannelOnCall(true)
        })

        socketClient.listenCallFinish(() => {
            setChannelOnCall(false)
        })
    }

    const initCurrentChannelId = (channels) => {
        var channelId = match.params.channelId;
        // var channelId = querySearch(history.location.search).channel;
        return channelId
    }

    const getMessage = (channelId) => {
        getMessageFromChannel({ channelId }).then((data) => {
            if (data?.error) {
            } else {
                setMessages(data)
                scrollToBottom()
                setLoading(false)
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

    const isMaximized = () => {
        if (maximized) {
            return 'maximized draggable-cont'
        } else {
            return 'draggable-cont'
        }
    }

    const moveDraggable = () => {
        var target = document.querySelector('.draggable-cont')
        TweenLite.to(target, 0, { x: 0, y: 0 })
    }

    const renderDraggable = () => {
        return liveChatPopUp && (
            <Draggable disabled={maximized} >
                <div className={isMaximized()}>
                    <div className="button-cont row">
                        {maximized && <div className="size-icon" onClick={() => setMaximized(!maximized)}><i class="fa fa-minus-square-o" aria-hidden="true"></i>
                        </div>}
                        {!maximized && <div className="size-icon" onClick={() => { setMaximized(!maximized); moveDraggable() }}><i class="fa fa-window-maximize" aria-hidden="true"></i>
                        </div>}
                        <div className="leave-icon" onClick={() => { setLiveChatPopUp(false); window.location.reload() }}><i class="fa fa-times" aria-hidden="true"></i>
                        </div>
                    </div>
                    <LiveChannel channelId={currentChannelId} />
                </div>
            </Draggable>
        )
    }

    const isChannelOnCall = () => {
        if (channelOnCall) {
            return 'channel-on-call'
        }
    }

    const handleJoinCall = () => {
        if (!channelOnCall) socketClient.initCallOnChannel(currentChannelId)
        setLiveChatPopUp(true)
    }
    console.log("access : ", access)
    return access ? (
        <div className="channel-content-cont">
            <div className={`live-chat-btn btn ${isChannelOnCall()}`} onClick={handleJoinCall}>
                <i class="fa fa-phone-square" aria-hidden=""></i>
                {channelOnCall && <span className="channel-on-call-msg">Channel is on call</span>}
            </div>
            <div className="content-cont">
                {/* {currentChannelId} */}
                {renderDraggable()}
                {renderMessages()}
            </div>
            <div className="new-message-cont ">
                <Input currentChannelId={currentChannelId} setLoading={setLoading} />
            </div>
            <Loader loading={loading} />
        </div>
    ) : (
            <div className="no-access-cont row JCC AIC" >
                {/* You have no access to this channel. */}
            </div>
        )
}

export default withRouter(ChannelContent)