import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, Link, withRouter } from "react-router-dom";
import chat from "./Chat.scss"

const Chat = ({ history, message, previousChatUser, index }) => {

    const [currentUser, setCurrentUser] = useState(message.user)
    console.log("message:  ", message)
    console.log("previousChatUser === currentUser.email:  ", previousChatUser === currentUser.email)


    const parseTimestamp = (time) => {

        var date = time.slice(0, 10);
        var time = time.slice(14, 19);

        return date + " " + time

    }

    const conditionalRender = () => {
        if (previousChatUser === currentUser.email && index !== 0) {
            return (
                <div className="each-message row">
                    <div className="row img-cont">
                        {/* <img src={currentUser.image} /> */}
                    </div>
                    <div className="text-cont">
                        <div className="message"> {message.message}</div>
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
                        <div className="message"> {message.message}</div>
                    </div>
                </div>
            )
            // }
        }
    }

    return conditionalRender()

}

export default withRouter(Chat)