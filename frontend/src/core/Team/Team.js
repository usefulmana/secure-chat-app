import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import { getTeamInfo } from '../../API/teamsAPI'
import Modal from '../../Template/Modal'
import Layout from '../Layout'
import { TweenLite } from 'gsap'
import TeamOptions from '../Common/TeamOptions'
// CSS
import './Team.scss'
import Channel from "./Channel";

const Team = ({ history, match }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    var token = jwt.token;

    const [teamId, setTeamId] = useState(match.params.teamId)
    const [teamInfo, setTeamInfo] = useState()

    const [editFormOpened, setEditFormOpened] = useState(false)
    const [teamToEdit, setTeamToEdit] = useState()

    useEffect(() => {
        getTeamInfo({ token, teamId }).then((data) => {
            console.log("data : ", data)

            setTeamInfo(data)
            // initEvent()
        }).catch((err) => {
            console.log("Error in Teams : ", err)
        })
    }, [])

    const initEvent = () => {
        console.log("target : ", document.querySelector(".edit-btn"))
        document.querySelector(".edit-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            var teamId = e.target.closest('.edit-btn').id
            setTeamToEdit(teamId)
            setEditFormOpened(true);
        });


    }

    const renderTeamInfo = () => {
        return (
            <>
                <TeamOptions team={teamInfo} />
                <div className="channel-header">Channel</div>
                <div className="channel-cont">
                    {teamInfo.channels.map((c) => {
                        { console.log("c : ", c) }
                        return <Channel teamId={teamId} channelName={c.name} channelId={c._id} />
                    }
                    )}
                </div>
            </>
        )
    }


    const conditionalRender = () => {
        if (teamInfo) {
            return (
                <Layout>
                    <div className="team-cont row" >
                        <div className="first">
                            {renderTeamInfo()}
                        </div>
                        <div className="second">
                            {/* show chat history */}
                        </div>
                    </div>
                </Layout>
            )
        } else {
            return <></>
        }
    }




    return (
        <>
            {conditionalRender()}

        </>
    )
}

export default Team