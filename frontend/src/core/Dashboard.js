import React, { useState, useEffect } from "react";

import ChatRoom from "./ChatRoom";
import Contact from "./Contact";
import Chats from "./Chats";

const Dashboard = ({ }) => {


    const [visible, setVisible] = useState('contact')

    useEffect(() => {

    })

    const handleClick = (option) => (e) => {
        if (option === 'contact') {
            setVisible(option)
        } else if (option === 'chats') {
            setVisible(option)
        }
    }

    return (
        <div className="row">
            <div className="col-4">
                <div className="navbar-options row align-items-center">
                    <div className="pointer option-btn" onClick={handleClick('contact')}>Contact</div>
                    <div className="pointer option-btn" onClick={handleClick('chats')}>Chats</div>
                </div>
                <Contact visible={visible} />
                <Chats visible={visible} />
            </div>
            <div className="col-8">
                <ChatRoom />
            </div>
        </div>
    )
}

export default Dashboard