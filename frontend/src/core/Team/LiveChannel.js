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

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        // <StyledVideo playsInline autoPlay ref={ref} />
        <video className="peer-video" playsInline autoPlay ref={ref} />
    );
}

const LiveChannel = ({ history, channelId }) => {


    const [peers, setPeers] = useState([]);
    const [tracks, setTracks] = useState({})
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = channelId;

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

            console.log("before setting")
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

        })
    }

    const initPeer = (stream) => {
        userVideo.current.srcObject = stream;
        socketClient.socket.emit("join room", roomID);
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
            const peer = addPeer(payload.signal, payload.callerID, stream);
            peersRef.current.push({
                peerID: payload.callerID,
                peer,
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
            const item = peersRef.current.find(p => p.peerID === payload.id);

            item.peer.signal(payload.signal);
        });
    }

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketClient.socket.emit("sending signal", { userToSignal, callerID, signal })
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
            {/* <StyledVideo muted ref={userVideo} autoPlay playsInline /> */}
            {console.log("peers: ", peers)}
            <video className="peer-video" muted ref={userVideo} autoPlay playsInline />
            {peers.map((peer, index) => {

                return index < 3 && (
                    <Video key={index} peer={peer} />
                );
            })}
            {renderOptions()}
        </div>
    );

}

export default withRouter(LiveChannel)