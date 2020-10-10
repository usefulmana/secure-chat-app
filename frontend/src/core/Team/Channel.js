import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, Link, withRouter } from "react-router-dom";
import { editChannel, deleteChannel } from '../../API/channelAPI'
import EditChannelForm from './EditChannelForm'
import Modal from '../../Template/Modal'
import { isUserHasAccessToThisChannel } from './handleAccess'
import AddMemberToPrivate from "../Common/AddMemberToPrivate";
import channel from "./Channel.scss"
import socketClient from '../../Socket/clinet'

const Channel = ({ history, match, teamInfo, channel, isAdmin }) => {
    const teamId = teamInfo._id
    const isPrivate = channel.isPrivate
    const channelName = channel.name
    const channelId = channel._id

    const [editFormOpened, setEditFormOpened] = useState(false)
    const [currentChannelId, setCurrentChannelId] = useState()
    const [accesToChannel, setAccessToChannel] = useState(isUserHasAccessToThisChannel(channel))


    const [notificationOn, setNotificationOn] = useState(false)

    const [addMemberFormOpened, setAddMemberFormOpened] = useState(false)

    const initSoket = () => {

    }

    useEffect(() => {
        setCurrentChannelId(match.params.channelId)
        socketClient.joinNotification(channel._id, showNotification)
        if (match.params.channelId === channelId) {
            setNotificationOn(false)
        }
    })

    const showNotification = (channelId) => {
        setNotificationOn(true)
    }

    const handleDelete = () => {
        var r = window.confirm("Leave the team?")
        if (r === true) {
            deleteChannel({ teamId, channelId }).then((data) => {
                console.log("data in deletechannel : ", data)
                if (data.error) {

                } else {
                    window.location.reload()
                }
            }).catch()
        }
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
        history.push(`/team/${teamId}/${channelId}`)
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
        channel: channel,
        teamMembers: teamInfo.members
    })

    const showOptions = () => {

        return isAdmin ?
            <>
                <div className="channel-option-btn" >
                    ...
                <div className="drop-down">
                        <div className="each-option edit-channel-btn" onClick={() => { setEditFormOpened(true) }}>Edit channel name</div>
                        <div className="each-option delete-channel-btn" onClick={handleDelete}>Delete channel</div>
                        {isPrivate && <div className="each-option delete-channel-btn" onClick={() => { setAddMemberFormOpened(true) }}>Add member</div>}
                    </div>
                </div>
            </>
            :
            <></>
    }

    return accesToChannel ? (
        <div className={isActive()} >
            {showOptions()}
            <div className="channel-name row AIC" onClick={handleClick}>
                {notificationOn && <i class="fas fa-circle notification"></i>}
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