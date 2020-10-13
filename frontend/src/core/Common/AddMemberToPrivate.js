import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import { findUser, getUserById } from '../../API/userAPI'
import { addToPrivateChannel } from '../../API/channelAPI'

import addMemberToPrivate from './AddMemberToPrivate.scss'
import base from './base.scss'

const AddMemberToPrivate = ({ history, reference }) => {
  var jwt = JSON.parse(localStorage.getItem("jwt"));
  var token = jwt.token;
  const { setOpened, channel, teamMembers } = reference.current

  const [addedMember, setAddedMember] = useState([])
  const [searchedMember, setSearchedMember] = useState([...teamMembers])
  // alert(JSON.stringify(searchedMember))
  // const [keyword, setKeyword] = useState("")
  const [values, setValues] = useState({ keyword: "" })
  const { keyword } = values;

  useEffect(() => {

    var newArr = []
    var count = 0
    var length = teamMembers.length
    teamMembers.map((m) => {
      getUserById({ userId: m }).then((data) => {
        if (data.error) {

        } else {
          if (length - 1 === count) {
            newArr.push(data)
            setSearchedMember(newArr)

          } else {
            count += 1
            newArr.push(data)
          }
        }
      }).catch()
    })
  }, [])


  const handleChange = (field) => (e) => {
    setValues({ ...values, [field]: e.target.value })
  }

  const handleSubmit = () => {

    var length = addedMember.length
    var count = 0
    addedMember.map((m) => {
      addToPrivateChannel({ channelId: channel._id, userId: m._id }).then(data => {
        if (data.error) {
          alert(data.error)
        } else {
          if (length - 1 === count) {
            alert("Succesfully added")
            window.location.reload()
          } else {
            count += 1
          }

        }
      }).catch(err => {
        console.log("err in chatForm : ", err)
      })
    })


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

    if (!alraedyExist) setAddedMember([...addedMember, m])
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
        <div className="title">Members in the team.</div>
        {/* <div className="row AIC input-cont">
          <input className="name-input input" value={keyword} onChange={handleChange('keyword')} />
          <i class="fas fa-search-plus search-btn" onClick={handleSearch}></i>
        </div> */}
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

export default withRouter(AddMemberToPrivate)