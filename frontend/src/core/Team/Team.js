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
import querySearch from "stringquery";
import { currentUser } from "../../API/userAPI";
import ChannelContent from "./ChannelContent";
import socketClient from "../../Socket/clinet"
import { isUserInThisTeam } from "./handleAccess";

const Team = ({ history, match }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    var userId = jwt.user._id;
    var token = jwt.token;

    const [teamId, setTeamId] = useState(match.params.teamId)
    const [teamInfo, setTeamInfo] = useState()
    const [channels, setChannels] = useState([])
    // const [currentChannel, setCurrentChannel] = useState()

    const [editFormOpened, setEditFormOpened] = useState(false)
    const [teamToEdit, setTeamToEdit] = useState()

    const [isAdmin, setIsAdmin] = useState()
    const [error, setError] = useState(false)
    const [access, setAccess] = useState(true)



    useEffect(() => {

        getTeamInfo({ token, teamId }).then((data) => {
            console.log("data : ", data)
            if (data.error) {
                setError(data.error)
            } else {
                setTeamInfo(data)
                setChannels(data.channels)
                setAccess(isUserInThisTeam(data))
                setIsAdmin(data.owner === userId)
            }

        }).catch((err) => {
            console.log("Error in Teams : ", err)
        })
    }, [])

    const renderTeamInfo = () => {
        return (
            <>
                <TeamOptions team={teamInfo} />
                <div className="channel-header">Channel</div>
                <div className="channel-cont">
                    {channels.map((c) => {
                        { console.log("c : ", c) }
                        return <Channel teamInfo={teamInfo} channel={c} isAdmin={isAdmin} />
                    }
                    )}
                </div>
            </>
        )
    }


    const conditionalRender = () => {
        console.log("access : ", access, "Error : ", error)
        if (teamInfo) {
            return (
                <Layout>
                    <div className="team-cont row" >
                        <div className="first">
                            {renderTeamInfo()}
                        </div>
                        <div className="second">
                            {/* show chat history */}
                            <ChannelContent />
                        </div>
                    </div>
                </Layout>
            )
        } else if (error || !access) {
            return <div>Invalid access</div>
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