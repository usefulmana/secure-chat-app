import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, Link, withRouter } from "react-router-dom";
import './LiveChannel.scss'
import socketClient from "../../Socket/clinet"
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
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = channelId;

    useEffect(() => {
        console.log("peersRef:", peersRef)
        console.log("peers:", peers)
        setPeers([])
        navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            socketClient.socket.emit("join room", roomID);
            socketClient.socket.on("all users", users => {
                console.log("all uesrs event reciveed : useres: ", users)
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketClient.socket.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push(peer);
                })
                console.log("before setpeer 1")
                setPeers(peers);
            })

            socketClient.socket.on("user joined", payload => {
                console.log("user join event")
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })
                console.log("before setpeer 2")

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
        })
    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            console.log("send sending signla evennt")
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
        console.log("sending signal")
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
        </div>
    );

}

export default withRouter(LiveChannel)