import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, Link, withRouter } from "react-router-dom";
import { getChannelInfo } from '../../API/channelAPI'
import { getMessageFromChannel } from '../../API/chatAPI'
import querySearch from "stringquery";
import Chat from "../Common/Chat"
import './Input.scss'
import socketClient from "../../Socket/clinet"
import { isUserHasAccessToThisChannel } from './handleAccess'
import Picker from 'emoji-picker-react';

const Input = ({ history, match, currentChannelId }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    const userId = jwt.user._id
    const [newMessage, setNewMessage] = useState()
    const [formData, setFormdata] = useState(new FormData())
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [emojoOpened, setEmojoOpened] = useState(false);

    const onEmojiClick = (event, emojiObject) => {
        // setNewMessage(newMessage+JSON.parse(emojiObject))
        setNewMessage(newMessage + emojiObject.emoji)
        // setChosenEmoji(emojiObject);
    };
    useEffect(() => {
        window.addEventListener('click', (e) => {
            console.log(e.target)

            var inside = e.target.closest('.emojo-cont')
            if (!inside) {
                setEmojoOpened(false)
            } else {
                setEmojoOpened(true)
            }
        })
    }, [])

    const renderEmojo = () => {
        return (<div>
            <Picker onEmojiClick={onEmojiClick} />
        </div>)
    }


    const handleFormData = async (e) => {
        var arr = []
        var length = e.target.files.length
        // for (let i = 0; i < length; i++) {
        //     formData.append(`file-${i}`, e.target.files[i])
        // }
        formData.append('file', e.target.files[0])
        formData.append('upload_preset', 'chattr')
        formData.append('folder', `chattr/${currentChannelId}`)

        var res = await fetch('https://api.cloudinary.com/v1_1/ddd5rvj1e/image/upload', {
            method: 'POST',
            body: formData
        })

        const file = await res.json()
        console.log("file : ", file)

        const formattedMessage = file.secure_url + `?filename=${file.original_filename}`
        socketClient.createNewMessge({ channelId: currentChannelId, userId, message: formattedMessage })
        // getMessage(currentChannelId)
        setNewMessage("")

    }

    // const handleFileSubmit = async () => {
    //     var res = await fetch('https://api.cloudinary.com/v1_1/ddd5rvj1e/image/upload', {
    //         method: 'POST',
    //         body: formData
    //     })

    //     const file = await res.json()
    //     console.log("file : ", file)

    //     const formattedMessage = file.secure_url + `?filename=${ file.original_filename }`
    //     socketClient.createNewMessge({ channelId: currentChannelId, userId, message: formattedMessage })
    //     // getMessage(currentChannelId)
    //     setNewMessage("")
    // }

    const handleSubmit = (e) => {
        e.preventDefault()
        socketClient.createNewMessge({ channelId: currentChannelId, userId, message: newMessage })
        // getMessage(currentChannelId)
        setNewMessage("")
    }



    const showNewMessageForm = () => {
        return (
            <form className="form-cont" onSubmit={handleSubmit} >
                <input placeholder="Start new chat!" className="" value={newMessage} onChange={(e) => { setNewMessage(e.target.value) }} />
                <div className="emojo-cont">
                    <i class="fa fa-smile-o" aria-hidden="true" ></i>
                    {emojoOpened && <div className="drop-up">
                        {renderEmojo()}
                    </div>}
                </div>
                <label class="custom-file-upload">
                    <input className="file-input" type="file" onChange={handleFormData} ></input>
                    <i class="fa fa-upload" aria-hidden="true"></i>
                </label>
            </form>
        )
    }

    return showNewMessageForm()

}

export default withRouter(Input)