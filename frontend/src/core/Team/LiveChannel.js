import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, Link, withRouter } from "react-router-dom";
import { getChannelInfo } from '../../API/channelAPI'
import { getMessageFromChannel } from '../../API/chatAPI'
import querySearch from "stringquery";
import './LiveChannel.scss'
import socketClient from "../../Socket/clinet"
import { isUserHasAccessToThisChannel } from './handleAccess'
import Peer from "simple-peer";


const Video = (props) => {

    const ref = useRef();
    var videoEnabled = undefined
    var micEnabled = undefined

    const { username, videoTrack, audioTrack } = props.peerRef
    console.log("props.peerRef in vdeio : ", props.peerRef)
    useEffect(() => {
        props.peer.on("stream", stream => {
            console.log("peer.getVideoTracks : ", stream.getVideoTracks())
            console.log("peer.getAudioTracks : ", stream.getAudioTracks())

            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <div className="video-cont peer-video">
            {videoTrack === false || videoTrack === undefined ?
                <div className="video-disabled row AIC JCC">
                    {username}
                </div>
                :
                <div className="username">{username}</div>
            }
            <video className="peer-video" playsInline autoPlay ref={ref} />
        </div>
    );
}

const LiveChannel = ({ history, channelId }) => {

    var jwt = JSON.parse(localStorage.getItem("jwt"));
    const username = jwt.user.username
    const [peers, setPeers] = useState([]);
    const [tracks, setTracks] = useState({})
    const socketRef = useRef();
    const userVideo = useRef();
    var peersRef = useRef([]);
    const roomID = channelId;
    const [dummy, setDummy] = useState(0)
    useEffect(() => {
        setPeers([])
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {

            setTracks({
                ...tracks,
                videoTrack: stream.getVideoTracks()[0],
                audioTrack: stream.getAudioTracks()[0]
            })

            initPeer(stream)
        }).catch(() => {
            requireAudio()
        })
    }, []);

    const requireAudio = () => {
        navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(stream => {
            setTracks({ ...tracks, audioTrack: stream.getAudioTracks()[0] })

            initPeer(stream)
        }).catch(() => {
            requireNone()
        })
    }

    const requireNone = () => {
        navigator.mediaDevices.getUserMedia({ video: false, audio: false }).then(stream => {
            initPeer(stream)
        }).catch(() => {
            // user has no mic and video enabled
            initPeer(new MediaStream)
        })
    }

    const initPeer = (stream) => {
        userVideo.current.srcObject = stream;
        socketClient.socket.emit("join room", { roomID, username });
        socketClient.socket.on("all users", users => {
            const peers = [];
            users.forEach(userID => {
                const peer = createPeer(userID, socketClient.socket.id, stream);
                peersRef.current.push({
                    peerID: userID,
                    peer,
                })
                peers.push(peer);
            })
            setPeers(peers);
        })

        socketClient.socket.on("user joined", payload => {
            console.log("user joined", payload)
            const peer = addPeer(payload.signal, payload.callerID, stream);
            peersRef.current.push({
                peerID: payload.callerID,
                peer,
                username: payload.username
            })

            setPeers(users => [...users, peer]);
        });

        socketClient.socket.on("user left", payload => {
            var newPeers = [...peers].filter(p => {
                if (p.peerId !== payload.peerId) {
                    return false
                } else {
                    return true
                }
            }
            )
            var newPeersRef = peersRef.current.filter((p) => {
                if (p.peerId !== payload.peerId) {
                    return false
                } else {
                    return true
                }
            })
            peersRef.current = newPeersRef

            setPeers([...newPeers]);
        });

        socketClient.socket.on("receiving returned signal", payload => {
            console.log("peersRef: ", peersRef.current)
            console.log("payload: ", payload)
            const item = peersRef.current.find(p => p.peerID.socketId === payload.id);

            item.peer.signal(payload.signal);
        });

        socketClient.socket.on("send-video-toggled", payload => {

            peersRef.current = peersRef.current.map(p => {
                if (p.peerID === payload.id) {
                    p[payload.option] = payload.value
                    return p
                } else {
                    return p
                }
            })
            setDummy(payload)
        });
    }

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketClient.socket.emit("sending signal", { userToSignal, callerID, signal, username })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketClient.socket.emit("returning signal", { signal, callerID })
        })

        // why you sending too much siganl
        peer.signal(incomingSignal);

        return peer;
    }

    const styleVideoBasedOnNum = () => {
        if (peers.length === 0) {
            return 'p-1'
        } else if (peers.length === 1) {
            return 'p-2'
        } else if (peers.length === 2) {
            return 'p-3'
        } else if (peers.length === 3) {
            return 'p-4'
        } else if (peers.length > 4) {
            return 'p-5'
        }
    }



    const handleToggle = (option) => () => {
        if (tracks[option]) {
            tracks[option].enabled = !tracks[option].enabled
            setTracks({ ...tracks })
            socketClient.socket.emit("user-toggle-video", { roomID, option, value: tracks[option].enabled })
        }
    }

    const renderOptions = () => {
        return (
            <div className="option-cont row">
                {console.log(tracks.audioTrack?.enabled)}
                {tracks.audioTrack?.enabled === true ?
                    <i class="fa fa-microphone" aria-hidden="true" onClick={handleToggle('audioTrack')}></i>
                    :
                    <i class="fa fa-microphone-slash" aria-hidden="true" onClick={handleToggle('audioTrack')}></i>

                }
                {tracks.videoTrack?.enabled === true ?
                    <i class="fa fa-video-camera" aria-hidden="true" onClick={handleToggle('videoTrack')}></i>
                    :
                    <div className="disable-video-cont">
                        <i class="fa fa-video-camera" aria-hidden="true" onClick={handleToggle('videoTrack')}></i>
                        <span>\</span>
                    </div>
                }
            </div>
        )
    }

    return (
        <div className={`live-chat-cont row-w AIC JCC ${styleVideoBasedOnNum()}`}>
            <div className="peer-video video-cont">
                <div>
                    {(!tracks.videoTrack || tracks?.videoTrack?.enabled === false) &&
                        <div className="video-disabled AIC JCC row">
                            You
                        </div>
                    }
                </div>
                <video className="peer-video" muted ref={userVideo} autoPlay playsInline />

            </div>

            {peers.map((peer, index) => {
                console.log("peersRef.current[index] : ", peersRef.current[index])
                return index < 3 && (
                    <Video key={index} peer={peer} peerRef={peersRef.current[index]} />
                );
            })}
            {renderOptions()}
        </div>
    );

}

export default withRouter(LiveChannel)