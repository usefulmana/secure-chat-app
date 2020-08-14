import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import './Profile.scss'
import { changeUsername, currentUser } from '../API/userAPI'

const Profile = ({ history }) => {
  var jwt = JSON.parse(localStorage.getItem("jwt"));
  var token = undefined

  if (!jwt) {
    history.push('/')
  } else {
    token = jwt.token
  }

  const [user, setUser] = useState({
    usrename: "",
    password: "",
    image: ""
  })

  const [disabled, setDisabled] = useState({
    username: true,
    password: true,
    image: ""
  })

  useEffect(() => {
    console.log("toekn : ", token)
    currentUser({ token }).then((data) => {
      console.log("what is data : ", data)
      setUser(data)
    }).catch((err) => {
      console.log("err : ", err)
    })
  }, [])


  const handleChange = (option) => (e) => {
    if (option === "username") {
      setUser({ ...user, username: e.target.value })
    } else if (option === "password") {
      setUser({ ...user, password: e.target.value })
    }
  }

  const handleClick = (option) => (e) => {
    if (option === "username") {
      setDisabled({ username: false, password: true })
    } else if (option === "password") {
      setDisabled({ username: true, password: false })
    }
  }

  const handleSubmit = (option) => (e) => {
    if (option === "username") {
      alert("useranme!")
      changeUsername({ username: user.username, token: token }).then((data) => {
        console.log("data received :", data)
      }).catch((err) => {

      })

    } else if (option === "password") {
      setDisabled({ username: true, password: false })
    }

  }

  const showOptions = (option) => {
    console.log("disalbed: ", disabled)
    // console.log("optiosn; ", option)

    if (option === "username" && disabled.username) {

      console.log("1")
      return (<button onClick={handleClick('username')}>Edit</button>)
    } else if (option === "username" && !disabled.username) {

      console.log("2")
      return (<button onClick={handleSubmit("username")}>Submit</button>)
    }

    if (option === "password" && disabled.password) {

      console.log("3")
      return (<button onClick={handleClick('password')}>Edit</button>)

    } else if (option === "password" && !disabled.password) {

      console.log("4")
      return (<button onClick={handleSubmit("password")}>Submit</button>)
    }
  }



  return (
    <div className="profile-cont">
      <div><img src={user.image} /></div>

      {/* <div>{user.username}</div>
      <div>{user.email}</div> */}
      <div>
        <input value={user.username} onChange={handleChange("username")} disabled={disabled.username} />
        {showOptions("username")}
      </div>
      <div>{user.email}</div>
      {/* {console.log(editable)} */}
      <div>
        <input type="password" onChange={handleChange("password")} disabled={disabled.password} />
        {showOptions("password")}
      </div>
    </div>
  )
}

export default Profile