import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, Link, withRouter } from "react-router-dom";
import { editChannel, deleteChannel } from '../../API/channelAPI'
import EditChannelForm from './EditChannelForm'
import Modal from '../../Template/Modal'
import querySearch from "stringquery";

import channel from './Channel.scss'

const Channel = ({ history, channelName, channelId, teamId }) => {
    console.log("channelName : ", channelName)

    const [editFormOpened, setEditFormOpened] = useState(false)
    const [currentChannelId, setCurrentChannelId] = useState()

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

    useEffect(() => {
        initCurrentChannelId()
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



    const handleClick = () => {
        history.push(`/team/${teamId}?channel=${channelId}`)

    }

    const eventInit = () => {
        var editChannelBtn = document.querySelector(`.edit-channel-btn-${channelId}`);
        editChannelBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            setEditFormOpened(true)
        });

        var deleteChannelBtn = document.querySelector(`.delete-channel-btn-${channelId}`);
        deleteChannelBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            var r = window.confirm("Delete the team?")
            if (r === true) {
                handleDelete()
            }
        });
    }


    const modalStyle = {
        width: '50vw',
        height: '40vw'
    }


    return (
        <div className={isActive()} >
            <div className="channel-option-btn" >
                ...
                <div className="drop-down">
                    <div className="each-option edit-channel-btn" onClick={() => { setEditFormOpened(true) }}>Edit channel name</div>
                    <div className="each-option delete-channel-btn" onClick={handleDelete}>Delete channel</div>

                    {/* <div className={`each-option edit-channel-btn-${channelId}`} >Edit channel name</div> */}
                    {/* <div className={`each-option delete-channel-btn-${channelId}`} >Delete channel</div> */}
                </div>

            </div>
            <div className="channel-name" onClick={handleClick}>
                {channelName}
            </div>
            <Modal opened={editFormOpened} setOpened={setEditFormOpened} options={modalStyle}>
                <EditChannelForm TeamsRef={useRef({ setOpened: setEditFormOpened })} channelName={channelName} channelId={channelId} />
            </Modal>

        </div>

    )
}

export default withRouter(Channel)