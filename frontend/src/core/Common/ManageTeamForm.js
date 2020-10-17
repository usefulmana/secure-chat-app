import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import { getUserById } from '../../API/userAPI'
import { kickMemberFromTeam } from '../../API/teamsAPI'

import './ManageTeamForm.scss'
import './base.scss'

const ManageTeamForm = ({ history, TeamsRef, team }) => {
  var jwt = JSON.parse(localStorage.getItem("jwt"));
  var token = jwt.token;
  console.log("team in manage team: ", team)
  const { setOpened } = TeamsRef.current

  const [values, setValues] = useState({ keyword: "" })
  const [members, setMembers] = useState([])
  const { keyword } = values;

  useEffect(() => {
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

  const handleKickUser = (userId) => (e) => {
    var r = window.confirm("Kick user?")
    if (r === true) {
      kickMemberFromTeam({ userId, teamId: team._id }).then(data => {
        window.location.reload()
      }).catch(err => {

      })
    }
  }

  const renderMembers = () => {
    return members.map(m => {

      if (m._id === team.owner) {
        return <></>
      }

      return (
        <div className="each-member row AIC" >
          <div className="img-cont"><img src={m.image} /></div>
          <div className="username">{m.username}</div>
          <div className="email">{m.email}</div>
          <i class="fa fa-sign-out" aria-hidden="true" onClick={handleKickUser(m._id)}></i>
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