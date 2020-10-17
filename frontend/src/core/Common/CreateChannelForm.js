import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import { createChannel, } from '../../API/channelAPI'
import './base.scss'
import './CreateChannelForm.scss'

const CreateTeamForm = ({ history, TeamsRef, teamId }) => {
  var jwt = JSON.parse(localStorage.getItem("jwt"));
  var token = jwt.token;

  const { setOpened } = TeamsRef.current

  const [values, setValues] = useState({})
  const [isPrivate, setIsPrivate] = useState(false)
  const { name } = values

  useEffect(() => {

  }, [])


  const handleChange = (field) => (e) => {
    setValues({ ...values, [field]: e.target.value })
  }

  const handleSubmit = () => {

    createChannel({ teamId, channelName: name, isPrivate }).then(data => {
      if (data.error) {

      } else {
        window.location.reload(false);
      }
    }).catch(err => {
      console.log("err in chatForm : ", err)
    })
  }

  const handleSelect = (e) => {
    setIsPrivate(e.target.value)
  }

  const options = [
    { value: false, label: 'No' },
    { value: true, label: 'Yes' }
  ]


  const showForm = () => {
    return (
      <div className="form-cont">
        <div>Name </div>
        <input className="name-input input" value={name} onChange={handleChange('name')} />
        <div>Is it private channel? </div>
        <select id="select-box" onChange={handleSelect} >
          <option className="option" value="false">No</option>
          <option className="option" value="true">Yes</option>
        </select>
      </div>
    )
  }

  const renderOption = () => {
    return (
      <div className="content-cont">
        <div className="header">Create new channel</div>
        {showForm()}
        <div className="row JCE">
          <div className="cancel-btn btn" onClick={() => setOpened(false)}>Cancel</div>
          <div className="submit-btn btn" onClick={handleSubmit}>Submit</div>
        </div>
      </div>
    )
  }



  return (
    <div className="create-channel-cont base-cont">
      {renderOption()}
    </div>
  )
}

export default withRouter(CreateTeamForm)