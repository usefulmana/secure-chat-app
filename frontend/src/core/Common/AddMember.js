import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import { findUser } from '../../API/userAPI'

import addMember from './AddMember.scss'
import base from './base.scss'

const AddMember = ({ history, TeamsRef, teamId }) => {
  var jwt = JSON.parse(localStorage.getItem("jwt"));
  var token = jwt.token;

  const { setOpened } = TeamsRef.current

  const [addedMember, setAddedMember] = useState([])
  const [searchedMember, setSearchedMember] = useState([])

  // const [keyword, setKeyword] = useState("")
  const [values, setValues] = useState({ keyword: "" })
  const { keyword } = values;

  useEffect(() => {

  }, [])


  const handleChange = (field) => (e) => {
    setValues({ ...values, [field]: e.target.value })
  }

  const handleSubmit = () => {
    // addMemberToTeam({ teamId, userId }).then(data => {
    //   console.log("Data: ", data)
    //   if (data.error) {

    //   } else {
    //     window.location.reload(false);
    //   }
    // }).catch(err => {
    //   console.log("err in chatForm : ", err)

    // })
  }

  const handleSearch = () => {
    findUser({ method: 'email', keyword }).then((data) => {
      console.log("data in find user : ", data)
      setSearchedMember(data)
    }).catch()
  }

  const showSearchResult = () => {
    return searchedMember.map((m) =>
      <div>
        {m}
      </div>
    )
  }

  const showAddedMember = () => {
    return addedMember.map((m) =>
      <div>
        {m}
      </div>
    )
  }

  const showForm = () => {
    return (
      <div className="form-cont">
        <div>Search member </div>
        <div className="row AIC input-cont">
          <input className="name-input input" value={keyword} onChange={handleChange('keyword')} />
          <i class="fas fa-search-plus search-btn" onClick={handleSearch}></i>
        </div>
        <div className="search-result-cont">
          {showSearchResult()}
        </div>
        <div className="added-member-cont">
          {showAddedMember()}
        </div>
      </div>
    )
  }

  const renderOption = () => {
    return (
      <div className="content-cont">
        <div className="header">Add members to the team</div>
        {showForm()}
        <div className="row JCE">
          <div className="cancel-btn btn" onClick={() => setOpened(false)}>Cancel</div>
          <div className="submit-btn btn" onClick={handleSubmit}>Submit</div>
        </div>
      </div>
    )
  }



  return (
    <div className="add-member-cont base-cont">
      {renderOption()}
    </div>
  )
}

export default withRouter(AddMember)