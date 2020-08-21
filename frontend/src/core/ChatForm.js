import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import './Chats.scss'
import { login, authenticate } from '../API/userAPI'
import { createChat } from '../API/chatAPI'
import Modal from '../Template/Modal'

const ChatForm = ({ chats, setChats }) => {
  var jwt = JSON.parse(localStorage.getItem("jwt"));
  var token = jwt.token;

  const [values, setValues] = useState({})
  const [formOpened, setFormOpened] = useState(false)

  const { name, description } = values

  useEffect(async () => {
    var servers = jwt.user.servers


  }, [])



  const CreateChatButton = () => {
    return <button onClick={() => setFormOpened(true)}>New chat</button>
  }


  const handleChange = (field) => (e) => {
    setValues({ ...values, [field]: e.target.value })
  }

  const handleSubmit = () => {
    createChat({ token, name, description }).then(data => {
      var newArray = []
      chats.forEach(chat=>{
        newArray.push(chat)
      })
      newArray.push(data)
      setChats(newArray)
      setFormOpened(false)
    }).catch(err => {
      console.log("err in chatForm : ", err)

    })
  }

  const showForm = () => {
    return (
      <div className="form-cont">
        Name: <input value={name} onChange={handleChange('name')} />
        Description : <input value={description} onChange={handleChange('description')} />
      </div>
    )
  }

  return (
    <div>
      {showForm()}
      <button className="submit-btn" onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default ChatForm