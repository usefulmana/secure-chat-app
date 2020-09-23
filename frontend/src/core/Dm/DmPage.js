import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import Modal from '../../Template/Modal'
import Layout from '../Layout'
import { TweenLite } from 'gsap'
import TeamOptions from '../Common/TeamOptions'
// CSS
import './DmPage.scss'
import Channel from "./Channel";
import querySearch from "stringquery";
import { currentUser } from "../../API/userAPI";
import { getDmChannel } from '../../API/channelAPI'

import ChannelContent from "../Team/ChannelContent";
import socketClient from "../../Socket/clinet"
import { isUserInThisTeam } from "./handleAccess";
import CreateChat from "./CreateChat";

const DmPage = ({ history, match }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    var userId = jwt.user._id;
    var token = jwt.token;

    // the list of DM chats

    const [channels, setChannels] = useState([])
    // const [currentChannel, setCurrentChannel] = useState()

    const [error, setError] = useState(false)
    const [access, setAccess] = useState(true)
    const [createChatOpened, setCreateChatOpened] = useState(false)

    useEffect(() => {
        getDmChannel().then((data) => {
            if (data.error) {
                setError(data.error)
            } else {
                setChannels(data)
            }
        }).catch((err) => {
            console.log("Error in Teams : ", err)
        })
    }, [])


    const showDmChannels = () => {
        return channels.map((c) => {
            { console.log(c.members[0]._id, " : ", userId) }
            return <div onClick={() => { history.push(`/dm/${c._id}`) }}>
                {c.members[0]._id !== userId ? c.members[0].username : c.members[1].username}
            </div>
        }
        )
    }

    const handleCreateChat = () => {

    }


    const refForCreateChat = useRef({ setOpened: setCreateChatOpened })
    const conditionalRender = () => {
        return (
            <Layout>
                <div className="team-cont row" >
                    <div className="first">
                        {/* the lsit of chats */}
                        <div onClick={() => setCreateChatOpened(true)}><i class="fa fa-plus-square" aria-hidden="true"></i>
                        </div>
                        {showDmChannels()}
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