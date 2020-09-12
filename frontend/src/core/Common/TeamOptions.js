import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import './TeamOptions.scss'
import { currentUser } from '../../API/userAPI'
import { getTeamInfo , deleteTeam} from '../../API/teamsAPI'


import { TweenLite } from 'gsap'

const TeamOptions = ({ history, team }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    var token = jwt.token;

    useEffect(() => {
        initEvent()
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
 
    const handleDelete = (teamId) => {
        deleteTeam({ teamId }).then((data) => {
            console.log("data in deleteTeam : ", data)
            if (data.error) {
                console.log("err in handleDelete : ", data.error)
            } else {
                history.push('/teams');
            }
        }).catch()
    }

    const initEvent = () => {
        document.querySelector(".delete-btn").addEventListener("click", (e) => {
            e.stopPropagation()
            var target = e.target.closest('.delete-btn')
            var teamId = target.id
            var r = window.confirm("Delete the team?")
            if (r === true) {
                handleDelete(teamId)
            }
        });
    }

    const renderTeam = () => {
        return (
            <>
                <div className="options">
                    <div className="show-drop-down-btn" >...</div>
                    <div className="drop-down">
                        <div className="each-option" onClick={handleAddMembers}><i class="fas fa-user-plus"></i>Add members to the team</div>
                        <div className="each-option edit-btn" id={team._id} ><i class="far fa-edit"></i>Edit team</div>
                        <div className="each-option delete-btn" id={team._id} ><i class="far fa-trash-alt"></i>Delete team</div>
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

    return (
        <div className="team-options-cont" >
            {renderTeam()}
        </div>
    )
}

export default withRouter(TeamOptions)