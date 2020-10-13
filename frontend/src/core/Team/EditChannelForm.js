import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import { createChannel, editChannel, } from '../../API/channelAPI'

import editChannelForm from './EditChannelForm.scss'

const CreateTeamForm = ({ history, reference }) => {
  var jwt = JSON.parse(localStorage.getItem("jwt"));
  var token = jwt.token;
  const { setOpened, channel } = reference.current
  const channelId = channel._id
  const channelName = channel.name

  const [values, setValues] = useState({ newChannelName: channelName })
  const { newChannelName } = values

  useEffect(() => {

  }, [])


  const handleChange = (field) => (e) => {
    setValues({ ...values, [field]: e.target.value })
  }

  const handleSubmit = () => {

    editChannel({ channelId, name: newChannelName }).then(data => {

      if (data.error || data.message) {
        alert(data.message)
        // setError(data.error)

      } else {
        window.location.reload(false);
      }
    }).catch(err => {
      console.log("err in edit channel form : ", err)
    })
  }


  const showForm = () => {
    return (
      <div className="form-cont">
        <div>Name </div>
        <input className="name-input input" value={newChannelName} onChange={handleChange('newChannelName')} />
      </div>
    )
  }

  const renderOption = () => {
    return (
      <div className="content-cont">
        <div className="header">Edit channel</div>
        {showForm()}
        <div className="row JCE">
          <div className="cancel-btn btn" onClick={() => setOpened(false)}>Cancel</div>
          <div className="submit-btn btn" onClick={handleSubmit}>Submit</div>
        </div>
      </div>
    )
  }



  return (
    <div className="edit-team-cont">
      {renderOption()}
    </div>
  )
}

export default withRouter(CreateTeamForm)