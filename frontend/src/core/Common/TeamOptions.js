import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import './TeamOptions.scss'
import { getTeamInfo } from '../../API/chatAPI'
import { currentUser } from '../../API/userAPI'

import { TweenLite } from 'gsap'

const TeamOptions = ({ history, team }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    var token = jwt.token;

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

    const handleDelete = () => {

    }

    const showDropDown = (e) => {

        console.log(e.target.parentNode.querySelector('.drop-down'))

    }

    const renderTeam = () => {
        return (
            <>
                <div className="options">
                    <div className="show-drop-down-btn" onClick={showDropDown}>...</div>
                    <div className="drop-down">
                        <div className="each-option" onClick={handleAddMembers}><i class="fas fa-user-plus"></i>Add members to the team</div>
                        <div className="each-option" onClick={handleAddMembers}><i class="far fa-edit"></i>Edit team</div>
                        <div className="each-option" onClick={handleDelete}><i class="far fa-trash-alt"></i>Delete team</div>
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

    const CreateChatButton = () => {
        return
    }

    // Moved this to parent component which is Team.
    // const closeAllDropDown = (e) => {
    //     var isBtn = e.target.classList.contains("show-drop-down-btn")
    //     var isOption = e.target.classList.contains("each-option")

    //     if (isBtn) {
    //         e.target.parentNode.querySelector('.drop-down').style.display = 'block'
    //     } else if (isOption) {

    //     } else {
    //         TweenLite.to('.drop-down', 0, { display: 'none' })
    //     }
    // }

    return (
        <div className="team-options-cont" >
            {renderTeam()}
        </div>
    )
}

export default TeamOptions