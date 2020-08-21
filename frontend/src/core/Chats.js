import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import './Chats.scss'
import { login, authenticate } from '../API/userAPI'
import { getChatInfo } from '../API/chatAPI'
import Modal from '../Template/Modal'
import ChatForm from './ChatForm'

const Chats = ({ visible }) => {
  var jwt = JSON.parse(localStorage.getItem("jwt"));
  var token = jwt.token;

  const [chats, setChats] = useState([])
  const [formOpened, setFormOpened] = useState(false)

  useEffect(async () => {
    var servers = jwt.user.servers

    var populatedChatInfo = []
    servers.forEach(async (chatId) => {
      await getChatInfo({ token, chatId }).then((data) => {
        populatedChatInfo.push(data)
      }).catch((err) => {
        console.log("err in chat : ", err)
      })
    });
    setChats(populatedChatInfo)
    console.log("beofre setCaht : ", populatedChatInfo)
  }, [])

  const renderChat = () => {
    return chats.map((c) =>
      <div className="chat-cont">
        {c.name} ({c.members.length}) {c.updated_at}
      </div>
    )
  }

  const CreateChatButton = () => {
    return <button onClick={() => setFormOpened(true)}>New chat</button>
  }

  const modalStyle = {
    width: '50vw',
    height: '20vh'
  }

  return visible === 'chats' && (
    <div>
      {CreateChatButton()}
      {renderChat()}

      <Modal opened={formOpened} setOpened={setFormOpened} options={modalStyle}>
        <ChatForm chats={chats} setChats={setChats}/>
      </Modal>
    </div>
  )
}

export default Chats