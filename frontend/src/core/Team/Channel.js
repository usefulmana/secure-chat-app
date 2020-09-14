import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, Link, withRouter } from "react-router-dom";
import { editChannel, deleteChannel } from '../../API/channelAPI'
import EditChannelForm from './EditChannelForm'
import Modal from '../../Template/Modal'
import querySearch from "stringquery";
import handleAccess from './handleAccess'
import channel from './Channel.scss'
import AddMemberToPrivate from "../Common/AddMemberToPrivate";

const Channel = ({ history, channel, teamId }) => {


    const { isPrivate, name, _id } = channel
    const channelName = name
    const channelId = _id

    const [editFormOpened, setEditFormOpened] = useState(false)
    const [currentChannelId, setCurrentChannelId] = useState()
    const [accesToChannel, setAccessToChannel] = useState(handleAccess(channel))

    const [addMemberFormOpened, setAddMemberFormOpened] = useState(false)

    const initCurrentChannelId = (channels) => {
        var query = querySearch(history.location.search);
        if (!query.channel) {
            // general as default
            if (channelName === "general") {
                setCurrentChannelId(channelId)
            }
        } else {
            setCurrentChannelId(query.channel)
        }
    }

    const initSoket=()=>{
        
    }

    useEffect(() => {
        initCurrentChannelId()
        handleAccess()
    })

    const handleDelete = () => {
        deleteChannel({ teamId, channelId }).then((data) => {
            console.log("data in deletechannel : ", data)
            if (data.error) {

            } else {
                window.location.reload()
            }
        }).catch()
    }

    const handleEdit = () => {

    }

    const isActive = () => {
        if (currentChannelId === channelId) {
            return 'active-channel each-channel'
        } else {
            return 'each-channel'

        }
    }

    // const isPrivate = () => {
    //     if (isPrivate === true) return 'private-channel-icon'
    // }

    const handleClick = () => {
        history.push(`/team/${teamId}?channel=${channelId}`)

    }


    const modalStyle = {
        width: '50vw',
        height: '40vw'
    }

    const refForEditChannel = useRef({
         setOpened: setEditFormOpened,
         channel: channel,
        })
    const refForAddToPrivate = useRef({
        setOpened: setAddMemberFormOpened,
        channel: channel
    })

    return accesToChannel ? (
        <div className={isActive()} >
            <div className="channel-option-btn" >
                ...
                    <div className="drop-down">
                    <div className="each-option edit-channel-btn" onClick={() => { setEditFormOpened(true) }}>Edit channel name</div>
                    <div className="each-option delete-channel-btn" onClick={handleDelete}>Delete channel</div>
                    <div className="each-option delete-channel-btn" onClick={() => { setAddMemberFormOpened(true) }}>Add member</div>

                </div>

            </div>
            <div className="channel-name" onClick={handleClick}>
                {channelName}
                {isPrivate && <i class="fas fa-lock private-channel-icon" ></i>}
            </div>
            <Modal opened={editFormOpened} setOpened={setEditFormOpened} options={modalStyle}>
                <EditChannelForm reference={refForEditChannel} channelName={channelName} channelId={channelId} />
            </Modal>

            <Modal opened={addMemberFormOpened} setOpened={setAddMemberFormOpened} options={modalStyle}>
                <AddMemberToPrivate reference={refForAddToPrivate} />
            </Modal>
        </div>
    ) : null
}

export default withRouter(Channel)