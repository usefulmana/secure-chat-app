import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, Link, withRouter } from "react-router-dom";
import chat from "./Chat.scss"
const queryString = require('query-string');

const Chat = ({ history, message, previousChatUser, index }) => {

    const [currentUser, setCurrentUser] = useState(message.user)


    const parseTimestamp = (time) => {

        var date = time.slice(0, 10);
        var time = time.slice(11, 16);

        return date + " " + time

    }

    const handleOpenFile = (url) => (e) => {
        var win = window.open(url, '_blank');
        win.focus();
    }

    const parseMessage = (url) => {
        var saerchQuery = url.split("?")
        const parsed = queryString.parse(saerchQuery[1]);
        console.log("parsed : ", parsed)
        var fileName = parsed.filename
        return fileName

    }

    const renderMessageContent = (message) => {

        var isFile = message?.includes('https://res.cloudinary.com/ddd5rvj1e/')
        var isImage = message?.includes('.png') || message?.includes('.jpg') || message?.includes('.jpeg')

        if (isFile && !isImage) {
            var fileName = parseMessage(message)
            return <div className="btn file-message" onClick={handleOpenFile(message)}>
                <i class="fa fa-file" aria-hidden="true" ></i>
                {fileName}
            </div>

        } else if (isImage && isFile) {
            return <img className="image-message btn" src={message} onClick={handleOpenFile(message)} />

        } else {
            return message
        }
    }

    const conditionalRender = () => {
        if (previousChatUser === currentUser.email && index !== 0) {
            return (
                <div className="each-message row">
                    <div className="row img-cont">
                        {/* <img src={currentUser.image} /> */}
                    </div>
                    <div className="text-cont">
                        <div className="message">{renderMessageContent(message.message)}</div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="each-message row">
                    <div className="row img-cont">
                        <img src={currentUser.image} />
                    </div>
                    <div className="text-cont">
                        <div className="first">
                            <span className="username">{currentUser.username}</span>
                            <span className="created-at">  {parseTimestamp(message.created_at)}</span>
                        </div>
                        <div className="message">{renderMessageContent(message.message)}</div>
                    </div>
                </div>
            )
            // }
        }
    }

    return conditionalRender()

}

export default withRouter(Chat)