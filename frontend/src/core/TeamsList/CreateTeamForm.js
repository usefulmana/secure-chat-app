import React, { useState, useEffect } from "react";
import { createTeam, joinTeam } from '../../API/teamsAPI'
import { currentUser, findUser } from '../../API/userAPI'
import './CreateTeamForm.scss'

const CreateTeamForm = ({ TeamsRef }) => {
  var jwt = JSON.parse(localStorage.getItem("jwt"));
  var token = jwt.token;

  console.log("TeamsRef.current : ", TeamsRef.current)
  const { setTeams, setCreateFormOpened } = TeamsRef.current

  const [values, setValues] = useState({})
  const { name, description, serverCode } = values

  const [joinOrCreate, setJoinOrCreate] = useState('create')

  useEffect(() => {


  }, [])


  const handleChange = (field) => (e) => {
    setValues({ ...values, [field]: e.target.value })
  }

  const handleSubmit = () => {
    createTeam({ token, name, description }).then(data => {
      if (data.error) {

      } else {
        currentUser().then((data) => {
          setTeams(data.servers)
          setCreateFormOpened(false)
        }).catch()
      }
    }).catch(err => {
      console.log("err in creating team : ", err)

    })
  }

  const handleJoin = () => {
    joinTeam({ serverCode }).then(data => {
      if (data.error) {

      } else {
        currentUser().then((data) => {
          setTeams(data.servers)
          setCreateFormOpened(false)
        }).catch()
      }
    }).catch(err => {
      console.log("err in joining team : ", err)

    })
  }


  const showForm = () => {
    return (
      <div className="form-cont">
        <div>Name </div>
        <input className="name-input input" value={name} onChange={handleChange('name')} />
        <div>Description </div>
        <textarea className="desc-input input" value={description} onChange={handleChange('description')} />
      </div>
    )
  }

  const renderOption = () => {
    return joinOrCreate === "create" ? (
      <div className="content-cont">
        <div className="header">Create your team</div>
        <div className="information">Collaborate closely with a group of people inside your organisation based on project, initiative or common interest.</div>
        {showForm()}
        <div className="row JCE">
          <div className="cancel-btn btn" onClick={() => setCreateFormOpened(false)}>Cancel</div>
          <div className="submit-btn btn" onClick={handleSubmit}>Submit</div>
        </div>
      </div>
    ) :
      <div className="content-cont">
        <div className="header">Join the team</div>
        <div className="form-cont">
            <div>Code </div>
            <input className="name-input input" value={serverCode} onChange={handleChange('serverCode')} />

          <div className="row JCE">
            <div className="cancel-btn btn" onClick={() => setCreateFormOpened(false)}>Cancel</div>
            <div className="submit-btn btn" onClick={handleJoin}>Submit</div>
          </div>
        </div>
      </div>
  }

  const isActive = (option) => {
    if (joinOrCreate === option) {
      return "active-each-option each-option"
    } else {
      return "each-option"
    }
  }

  return (
    <div className="create-or-join-cont">
      <div className="row option-header">
        <div className={isActive("join")} onClick={() => { setJoinOrCreate("join") }}>Join</div>
        <div className={isActive("create")} onClick={() => { setJoinOrCreate("create") }}>Create</div>
      </div>
      {renderOption()}
    </div>

  )
}

export default CreateTeamForm