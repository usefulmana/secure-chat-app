import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { editChannel, deleteChannel } from '../../API/channelAPI'
import EditChannelForm from './EditChannelForm'
import Modal from '../../Template/Modal'

import channel from './Channel.scss'

const Channel = ({ history, channelName, channelId, teamId }) => {
    console.log("channelName : ", channelName)

    const [editFormOpened, setEditFormOpened] = useState(false)

    const handleDelete = () => {
        deleteChannel({ teamId, channelName }).then((data) => {
            if (data.error) {

            } else {
                window.location.reload()
            }
        }).catch()
    }

    const handleEdit = () => {

    }

    const modalStyle = {
        width: '50vw',
        height: '40vw'
    }

    return (
        <div className="each-channel">
            <div className="channel-option-btn">
                ...
                <div className="drop-down">
                    <div className="each-option" onClick={() => { setEditFormOpened(true) }}>Edit channel name</div>
                    <div className="each-option" onClick={handleDelete}>Delete channel name</div>
                </div>

            </div>
            {channelName}

            <Modal opened={editFormOpened} setOpened={setEditFormOpened} options={modalStyle}>
                <EditChannelForm TeamsRef={useRef({ setOpened: setEditFormOpened })} channelName={channelName} channelId={channelId} />
            </Modal>

        </div>

    )
}

export default Channel