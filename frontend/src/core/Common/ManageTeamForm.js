import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import { getUserById } from '../../API/userAPI'

import manageTeamForm from './ManageTeamForm.scss'
import base from './base.scss'

const ManageTeamForm = ({ history, TeamsRef, team }) => {
  var jwt = JSON.parse(localStorage.getItem("jwt"));
  var token = jwt.token;
  console.log("team in manage team: ", team)
  const { setOpened } = TeamsRef.current

  // const [keyword, setKeyword] = useState("")
  const [values, setValues] = useState({ keyword: "" })
  const [members, setMembers] = useState([])
  const { keyword } = values;

  useEffect(() => {
    console.log("team.members.lengt : ", team.members.length)
    var newArr = []
    var count = 0
    var length = team.members.length
    team.members.map((m) => {
      getUserById({ userId: m }).then((data) => {
        if (data.error) {

        } else {
          if (length - 1 === count) {
            newArr.push(data)
            setMembers(newArr)

          } else {
            count += 1
            newArr.push(data)
          }
        }
      }).catch()
    })
  }, [])

  const renderMembers = () => {
    console.log("length :", members.length)
    return members.map(m => {
      return (
        <div className="each-member row AIC" >
          <div className="img-cont"><img src={m.image} /></div>
          <div className="username">{m.username}</div>
          <div className="email">{m.email}</div>
        </div>
      )
    })
  }

  const showForm = () => {
    return (
      <div className="form-cont">
        <div className="title">List of members </div>
        <div className="member-cont">
          <div className="member-wrap">
            {renderMembers()}
          </div>
        </div>
      </div>
    )
  }

  const renderOption = () => {
    return (
      <div className="content-cont">
        <div className="header">Manage team</div>
        {showForm()}
        <div className="row JCE button-cont">
          <div className="cancel-btn btn" onClick={() => setOpened(false)}>Cancel</div>
          <div className="submit-btn btn" onClick={() => { }}>Submit</div>
        </div>
      </div>
    )
  }



  return (
    <div className="manage-team-cont base-cont">
      {renderOption()}
    </div>
  )
}

export default withRouter(ManageTeamForm)