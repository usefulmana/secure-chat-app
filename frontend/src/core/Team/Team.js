import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import { getTeamInfo } from '../../API/teamsAPI'
import Layout from '../Layout'
import TeamOptions from '../Common/TeamOptions'

// CSS
import './Team.scss'
import Channel from "./Channel";
import ChannelContent from "./ChannelContent";
import { isUserInThisTeam } from "./handleAccess";

const Team = ({ history, match }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    var userId = jwt.user._id;
    var token = jwt.token;

    const [teamId, setTeamId] = useState(match.params.teamId)
    const [teamInfo, setTeamInfo] = useState()
    const [channels, setChannels] = useState([])

    const [isAdmin, setIsAdmin] = useState()
    const [error, setError] = useState(false)
    const [access, setAccess] = useState(true)

    useEffect(() => {
        getTeamInfo({ token, teamId }).then((data) => {
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
                        return <Channel teamInfo={teamInfo} channel={c} isAdmin={isAdmin} />
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