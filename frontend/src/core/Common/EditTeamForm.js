import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import { getTeamInfo,editTeam } from '../../API/teamsAPI'

import editTeamForm from './EditTeamForm.scss'
import base from './base.scss'

const EditTeamForm = ({history, TeamsRef, teamId }) => {
  var jwt = JSON.parse(localStorage.getItem("jwt"));
  var token = jwt.token;

  const { setOpened } = TeamsRef.current

  const [values, setValues] = useState({})
  const { name, description } = values

  useEffect(() => {
    // alert(teamId)
    getTeamInfo({ token, teamId }).then((data) => {
      setValues({ name: data.name, description: data.description })
    }).catch((err) => {
      console.log("Error in Teams : ", err)
    })
  }, [])


  const handleChange = (field) => (e) => {
    setValues({ ...values, [field]: e.target.value })
  }

  const handleSubmit = () => {
    editTeam({ teamId, name, description }).then(data => {
      if (data.error) {

      } else {
        window.location.reload(false);
      }
    }).catch(err => {
      console.log("err in chatForm : ", err)

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
    return (
      <div className="content-cont">
        <div className="header">Edit your team</div>
        {showForm()}
        <div className="row JCE">
          <div className="cancel-btn btn" onClick={() => setOpened(false)}>Cancel</div>
          <div className="submit-btn btn" onClick={handleSubmit}>Submit</div>
        </div>
      </div>
    )
  }



  return (
    <div className="edit-team-cont base-cont">
      {renderOption()}
    </div>
  )
}

export default withRouter(EditTeamForm)