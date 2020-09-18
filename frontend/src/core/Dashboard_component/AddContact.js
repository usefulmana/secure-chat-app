import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import './Contact.scss'
import { login, authenticate, findUser } from '../../API/userAPI'

const AddContact = ({ visible }) => {
  var jwt = JSON.parse(localStorage.getItem("jwt"));
  var token= jwt.token


  const [option, setOption] = useState('username')
  const [values, setValues] = useState({})
  const { username, email } = values
  const [result, setResult] = useState([])

  useEffect(() => {

  }, [])

  const showOption = () => {
    return (
      <div className="row ">
        <div className="cursor-pointer" onClick={() => setOption('username')}>
          Find by username
        </div>
        <div className="cursor-pointer" onClick={() => setOption('email')}>
          Find by email
        </div>
      </div>

    )
  }

  const handleClick = () => {
    findUser({ token,method: option, keyword: values[option] }).then(data => {
      console.log("Data : ", data)
      setResult(data)
    }).catch(err => {

    })
  }

  const handleChange = (option) => (e) => {
    setValues({ ...values, [option]: e.target.value })
  }

  const showForm = () => {
    return option === 'username' ? (
      <div>
        <input placeholder="Type username" value={username} onChange={handleChange('username')} /><button onClick={handleClick}>find</button>
      </div>
    ) : (
        <div>

          <input placeholder="Type email" value={email} onChange={handleChange('email')} /><button onClick={handleClick}>find</button>
        </div>
      )
  }

  const showResult = () => {
    return (
      <div>
        {result.map(r => <div>{r.username}</div>)}
      </div>
    )
  }

  return (
    <div>
      {showOption()}
      {showForm()}
      {showResult()}
    </div>
  )
}

export default AddContact