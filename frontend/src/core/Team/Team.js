import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import { getTeamInfo } from '../../API/chatAPI'
import Modal from '../../Template/Modal'
import Layout from '../Layout'
import { TweenLite } from 'gsap'
import TeamOptions from '../Common/TeamOptions'
// CSS
import './Team.scss'

const Team = ({ history, match }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    var token = jwt.token;

    const [teamId, setTeamId] = useState(match.params.teamId)
    const [teamInfo, setTeamInfo] = useState()

    useEffect(() => {
        getTeamInfo({ token, teamId }).then((data) => {
            setTeamInfo(data)
            console.log("Data : ", data)
        }).catch((err) => {
            console.log("Error in Teams : ", err)
        })
    }, [])



    const renderTeamInfo = () => {
        return (
            <>
                <TeamOptions team={teamInfo} />
                <div className="channel-header">Channel</div>
                {/* <div>{teamInfo.channel.map((c) =>
                    <div>{c.name}</div>
                )}</div> */}
            </>
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


    const conditionalRender = () => {
        if (teamInfo) {
            return (
                <Layout>
                    {JSON.stringify(teamInfo)}
                    <div className="team-cont row" onClick={closeAllDropDown}>
                        <div className="first">
                            {renderTeamInfo()}
                        </div>
                        <div className="second">
                            {/* show chat history */}
                            awef
                        </div>
                    </div>
                </Layout>
            )
        } else {
            return <div></div>
        }
    }

    return conditionalRender()
}

export default Team