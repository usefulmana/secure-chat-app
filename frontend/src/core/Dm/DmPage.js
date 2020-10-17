import React, { useState, useEffect, useRef } from "react";
import Modal from '../../Template/Modal'
import Layout from '../Layout'

// CSS
import './DmPage.scss'
import { getDmChannel } from '../../API/channelAPI'
import { getLastMessage } from '../../API/chatAPI'

import ChannelContent from "../Team/ChannelContent";
import CreateChat from "./CreateChat";

const DmPage = ({ history, match }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    var userId = jwt.user._id;
    var token = jwt.token;
    var currentChannelId = match.params.channelId;

    // the list of DM chats
    const [channels, setChannels] = useState([])

    const [error, setError] = useState(false)
    const [access, setAccess] = useState(true)
    const [createChatOpened, setCreateChatOpened] = useState(false)

    useEffect(() => {
        getDmChannel().then((data) => {
            if (data.error) {
                setError(data.error)
            } else {
                getLastMessageOfChannels(data)
            }
        }).catch((err) => {
            console.log("Error in getting dm channel : ", err)
        })
    }, [])

    const getLastMessageOfChannels = (cs) => {
        const copied =[...cs]

        cs.map((c, index) => {
            getLastMessage({ channelId: c._id }).then((data) => {
                console.log("channels : ", channels)
                console.log("data : ", data)
                var message = data.message
                var timestamp = data.created_at

                copied[index].message = message
                copied[index].timestamp = timestamp
               
                console.log("channel in here : ", channels)
                setChannels([...copied])

            }).catch()
        })
    }

    const isActive = (channelId) => {
        if (currentChannelId === channelId) {
            return 'active-channel'
        }
    }

    const parseTimestamp = (time) => {
        if (!time) return ""

        var date = time.slice(0, 10);
        var time = time.slice(11, 16);

        return date + " " + time
    }

    const showDmChannels = () => {
        return channels.map((c) => {

            const currentMember = c.members[0]._id !== userId ? c.members[0] : c.members[1]

            return <div className={`row AIC each-user ${isActive(c._id)}`} onClick={() => { history.push(`/dm/${c._id}`) }}>
                <img src={currentMember.image} />
                <div class="chat-info-cont">
                    <div className="username">{currentMember.username}

                    </div>
                    <div className="timestamp">
                        {parseTimestamp(c?.timestamp)}
                    </div>
                </div>
            </div>
        }
        )
    }

    const refForCreateChat = useRef({ setOpened: setCreateChatOpened })
    const conditionalRender = () => {
        return (
            <Layout>
                <div className="dm-page-cont row" >
                    <div className="first">
                        {/* the lsit of chats */}
                        <div className="row JCE">
                            <div className="create-chat-btn btn" onClick={() => setCreateChatOpened(true)}><i class="fa fa-plus-square-o" aria-hidden="true"></i>
                            </div>
                        </div>
                        <div className="dm-channel-cont">
                            {showDmChannels()}
                        </div>
                    </div>
                    <div className="second">
                        {/* show chat history */}
                        <ChannelContent />
                    </div>
                </div>
                <Modal opened={createChatOpened} setOpened={setCreateChatOpened}>
                    <CreateChat reference={refForCreateChat} />
                </Modal>
            </Layout>
        )
    }


    return (
        <>
            {conditionalRender()}
        </>
    )
}

export default DmPage