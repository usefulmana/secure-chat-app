import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import './TeamsList.scss'
import { getTeamInfo } from '../../API/chatAPI'
import { currentUser } from '../../API/userAPI'

import Modal from '../../Template/Modal'
import CreateTeamForm from './CreateTeamForm'
import Layout from '../Layout'
import { TweenLite } from 'gsap'

const TeamsList = ({ history }) => {
  var jwt = JSON.parse(localStorage.getItem("jwt"));
  var token = jwt.token;

  const [teams, setTeams] = useState([])
  const [createFormOpened, setCreateFormOpened] = useState(false)

  const TeamsRef = useRef({
    setTeams,
    setCreateFormOpened
  })

  const getEachTeamInfo = (teams) => {

    var populatedChatInfo = []
    var number = 0
    teams.forEach((teamId) => {
      getTeamInfo({ token, teamId }).then((data) => {
        populatedChatInfo.push(data)
        number = number + 1
        if (teams.length === number) {
          setTeams(populatedChatInfo)
        }
      }).catch((err) => {
        console.log("Error in Teams : ", err)
      })
    });
  }

  useEffect(() => {


    currentUser().then((data) => {
      var teams = data.servers
      getEachTeamInfo(teams)
    }).catch()

    var teamsIdList = jwt.user.servers
    var populatedChatInfo = []
    var number = 0
    console.log("whatsi teams : ", teams)
    teamsIdList.forEach((teamId) => {
      getTeamInfo({ token, teamId }).then((data) => {
        populatedChatInfo.push(data)
        number = number + 1
        if (teamsIdList.length === number) {
          setTeams(populatedChatInfo)
        }
      }).catch((err) => {
        console.log("Error in Teams : ", err)
      })
    });
  }, [])

  const parseTeamName = (name) => {
    var arr = name.split(" ")
    console.log(arr.length - 1 > 0, arr)

    if (arr.length - 1 > 0) {
      return <span>{arr[0].charAt(0)} {arr[1].charAt(0)}</span>
    } else {
      return <span>{arr[0].charAt(0)} {arr[0].charAt(1)}</span>
    }
  }

  const handleAddMembers = () => {

  }

  const handleDelete = () => {

  }

  const showDropDown = (e) => {

    console.log(e.target.parentNode.querySelector('.drop-down'))


  }

  const renderTeams = () => {
    console.log("teasm : ", teams)
    return (
      <div className="teams-list-cont row-w ">
        {teams.map((c) =>
          <div className="each-team" onClick={() => { history.push(`/team/${c._id}`) }}>
            <div className="options">
              <div className="show-drop-down-btn" onClick={showDropDown}>...</div>
              <div className="drop-down">
                <div className="each-option" onClick={handleAddMembers}><i class="fas fa-user-plus"></i>Add members to the team</div>
                <div className="each-option" onClick={handleAddMembers}><i class="far fa-edit"></i>Edit team</div>
                <div className="each-option" onClick={handleDelete}><i class="far fa-trash-alt"></i>Delete team</div>
              </div>
            </div>
            <div class="team-image row JCC AIC">
              {parseTeamName(c.name)}
            </div>
            <div class="team-name">
              {c.name}
            </div>
          </div>
        )}
      </div>
    )
  }

  const CreateChatButton = () => {
    return
  }



  const renderHeader = () => {
    return (
      <div className="teams-header row JCB">
        <div className="first">
          Teams
        </div>
        <div className="second row AIC" onClick={() => setCreateFormOpened(true)}>
          <i class="fa fa-pencil-square-o "></i>
          <div className="create-btn btn" >Join or create teams</div>
        </div>
      </div>
    )
  }

  const closeAllDropDown = (e) => {
    var isBtn = e.target.classList.contains("show-drop-down-btn")
    var isOption = e.target.classList.contains("each-option")

    if (isBtn) {
      e.target.parentNode.querySelector('.drop-down').style.display = 'block'
    } else if (isOption) {

    } else {
      TweenLite.to('.drop-down', 0, { display: 'none' })
    }
  }


  const modalStyle = {
    width: '50vw',
    height: '40vw'
  }

  return (
    <Layout>
      <Modal opened={createFormOpened} setOpened={setCreateFormOpened} options={modalStyle}>
        <CreateTeamForm TeamsRef={TeamsRef} />
      </Modal>
      <div className="teams-list-cont" onClick={closeAllDropDown}>
        {renderHeader()}
        {renderTeams()}

      </div>
    </Layout>
  )
}

export default TeamsList