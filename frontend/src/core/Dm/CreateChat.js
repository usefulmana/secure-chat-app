import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import { findUser } from '../../API/userAPI'
import { createDmChannel } from '../../API/channelAPI'
import Swal from "sweetalert2"
import './CreateChat.scss'
import '../Common/base.scss'

const CreateChat = ({ history, reference, teamId }) => {
  var jwt = JSON.parse(localStorage.getItem("jwt"));
  var token = jwt.token;
  const { setOpened } = reference.current

  const [addedMember, setAddedMember] = useState([])
  const [searchedMember, setSearchedMember] = useState([])

  const [values, setValues] = useState({ keyword: "" })
  const { keyword } = values;

  useEffect(() => {

  }, [])


  const handleChange = (field) => (e) => {
    setValues({ ...values, [field]: e.target.value })
    handleSearch()
  }

  const handleSubmit = () => {
    createDmChannel({ addedMember: addedMember[0]._id }).then((data) => {
      if (data.error || data.message) {
        Swal.fire({
          title: "Success!",
          icon: "success",
          timer: 2000
        })
      } else {
        window.location.reload()
      }
    }).catch()
  }

  const handleSearch = () => {
    findUser({ method: 'email', keyword }).then((data) => {
      setSearchedMember(data)
    }).catch()
  }


  const handleAdd = (m) => () => {
    var alraedyExist = false
    addedMember.map(addedM => {
      if (addedM.email === m.email) alraedyExist = true
    })

    if (!alraedyExist) setAddedMember([m])
  }

  const showSearchResult = () => {
    return searchedMember?.map((m) =>
      <div className="each-member row AIC" onClick={handleAdd(m)}>
        <div className="img-cont"><img src={m.image} /></div>
        <div className="username">{m.username}</div>
        <div className="email">{m.email}</div>
      </div>
    )
  }

  const handleDelete = (index) => (e) => {

    var array = [...addedMember]; // make a separate copy of the array
    array.splice(index, 1);
    setAddedMember(array);

  }

  const showAddedMember = () => {

    if (addedMember.length < 1) return <></>
    return (
      <>
        <div className="title">Member added</div>
        <div className="added-member-wrap">
          {addedMember.map((m, i) =>
            <div className="each-member row AIC" >
              <div className="img-cont"><img src={m.image} /></div>
              <div className="username">{m.username}</div>
              <div className="email">{m.email}</div>
              <div className="delete-btn" onClick={handleDelete(i)}>x</div>
            </div>
          )}
        </div>
      </>
    )
  }

  const showForm = () => {
    return (
      <div className="form-cont">
        <div className="title">Search member </div>
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
        <div className="header">Create chat</div>
        {showForm()}
        <div className="row JCE button-cont">
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

export default withRouter(CreateChat)