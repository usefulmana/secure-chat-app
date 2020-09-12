import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import './TeamOptions.scss'
import { currentUser } from '../../API/userAPI'
import { getTeamInfo, deleteTeam, leaveTeam } from '../../API/teamsAPI'

import Modal from '../../Template/Modal'
import EditTeamForm from '../Common/EditTeamForm'
import CreateChannelForm from '../Common/CreateChannelForm'

import { TweenLite } from 'gsap'

const TeamOptions = ({ history, team }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    var token = jwt.token;

    const [editFormOpened, setEditFormOpened] = useState(false)
    const [createFormOpened, setCreateFormOpened] = useState(false)



    useEffect(() => {
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

    const handleDelete = (teamId) => () => {
        var r = window.confirm("Delete the team?")
        if (r === true) {
            deleteTeam({ teamId }).then((data) => {
                console.log("data in deleteTeam : ", data)
                if (data.error) {
                    console.log("err in handleDelete : ", data.error)
                } else {
                    history.push('/teams');
                }
            }).catch()
        }
    }

    // const initEvent = () => {
    //     document.querySelector(".delete-btn").addEventListener("click", (e) => {


    //     });
    // }


    const handleLeaveTeam = (teamId) => (e) => {
        var target = e.target.closest('.leave-team-btn')
        var teamId = target.id
        var r = window.confirm("Leave the team?")
        if (r === true) {
            leaveTeam({ serverId: teamId }).then((data) => {
                console.log("data in leaveTeam : ", data)
                if (data.error) {
                    console.log("err in handleLeaveTeam : ", data.error)
                } else {
                    history.push('/teams');
                }
            }).catch()
        }
    }

    const renderTeam = () => {
        return (
            <>
                <div className="options">
                    <div className="show-drop-down-btn" >...</div>
                    <div className="drop-down">
                        <div className="each-option" onClick={handleAddMembers}><i class="fas fa-user-plus"></i>Add members to the team</div>
                        <div className="each-option edit-btn" onClick={() => { setEditFormOpened(true) }} ><i class="far fa-edit"></i>Edit team</div>
                        <div className="each-option delete-btn" onClick={handleDelete(team._id)}><i class="far fa-trash-alt"></i>Delete team</div>
                        <div className="each-option create-btn" onClick={() => { setCreateFormOpened(true) }}><i class="far fa-plus-square"></i>Create channel</div>
                        <div className="each-option leave-team-btn" onClick={() => { handleLeaveTeam(team._id) }}><i class="fas fa-sign-out-alt"></i>Leave team</div>

                    </div>
                </div>
                <div class="team-image row JCC AIC">
                    {parseTeamName(team.name)}
                </div>
                <div class="team-name">
                    {team.name}
                </div>
            </>
        )
    }

    const modalStyle = {
        width: '50vw',
        height: '40vw'
    }

    return (
        <div className="team-options-cont" >
            {renderTeam()}

            <Modal opened={editFormOpened} setOpened={setEditFormOpened} options={modalStyle}>
                <EditTeamForm TeamsRef={useRef({ setOpened: setEditFormOpened })} teamId={team._id} />
            </Modal>

            <Modal opened={createFormOpened} setOpened={setCreateFormOpened} options={modalStyle}>
                <CreateChannelForm TeamsRef={useRef({ setOpened: setCreateFormOpened })} teamId={team._id} />
            </Modal>
        </div>
    )
}

export default withRouter(TeamOptions)