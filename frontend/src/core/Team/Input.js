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
import { parseFileMessage, parseFileName } from "../Common/parse"

const Input = ({ history, match, currentChannelId, setLoading }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    const userId = jwt.user._id
    const [newMessage, setNewMessage] = useState()
    const [formData, setFormdata] = useState(new FormData())
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [emojoOpened, setEmojoOpened] = useState(false);
    const [caretPosition, setCaretPosition] = useState();
    const [pendingFile, setPendingFile] = useState("")

    const onEmojiClick = (event, emojiObject) => {
        if (newMessage) {
            var firstString = newMessage.slice(0, caretPosition)
            var secondString = newMessage.slice(caretPosition)
            setNewMessage(firstString + emojiObject.emoji + secondString)
        } else {
            setNewMessage(emojiObject.emoji)
        }

    };
    useEffect(() => {
        window.addEventListener('click', (e) => {
            // console.log(e.target)

            var inside = e.target.closest('.emojo-cont')
            if (!inside) {
                setEmojoOpened(false)
            } else {
                setEmojoOpened(true)
            }
        })

        document.querySelector('.message-input').addEventListener('click', e => {
            setCaretPosition(e.target.selectionStart)
        })

        document.querySelector('.message-input').addEventListener('keyup', e => {
            setCaretPosition(e.target.selectionStart)
        })
    }, [])

    const renderEmojo = () => {
        return (<div>
            <Picker onEmojiClick={onEmojiClick} />
        </div>)
    }


    const handleFormData = async (e) => {
        setLoading(true)

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
        console.log("formattedMessage : ", formattedMessage)
        setPendingFile(formattedMessage)
        setLoading(false)

    }

    const handleSubmit = (e) => {
        e.preventDefault()
        var messaegeToSend = newMessage
        if (pendingFile !== "") messaegeToSend = pendingFile + `&message=${newMessage}`
        console.log("messaegeToSend : ", messaegeToSend)
        socketClient.createNewMessge({ channelId: currentChannelId, userId, message: messaegeToSend })
        // getMessage(currentChannelId)
        setNewMessage("")
        setPendingFile("")
    }

    const handleOpenFile = (url) => (e) => {
        var win = window.open(url, '_blank');
        win.focus();
    }

    const filePreView = () => {
        var isImage = pendingFile?.includes('.png') || pendingFile?.includes('.jpg') || pendingFile?.includes('.jpeg')
        var fileName = parseFileName(pendingFile)

        if (isImage) {
            return <div className="btn file-message" >
                <img src={pendingFile} />
            </div>
        } else {

            return <div className="btn file-message" >
                <i class="fa fa-file" aria-hidden="true" ></i>
                {fileName}
            </div>
        }
    }

    const removeFile = () => {
        setPendingFile("")
    }

    const showNewMessageForm = () => {
        return (
            <form className="form-cont" onSubmit={handleSubmit} >
                {pendingFile &&
                    <div className="file-preview-cont">
                        <div className="delete-btn btn" onClick={removeFile}>x</div>
                        {filePreView()}
                    </div>
                }
                <input placeholder="Start new chat!" className="message-input" value={newMessage} onChange={(e) => { setNewMessage(e.target.value) }} />
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