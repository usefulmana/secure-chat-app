import socketIOClient from "socket.io-client";
import { BASE_URL } from "../config"


class socketClientClass {
    constructor() {
        // this.socket = undefined
        // this.userId = undefined
        this.socket = socketIOClient(BASE_URL);
        // this.userId = userId
        this.events = {
            channels: [],
            notification: []
        }

    }

    init(userId) {
        console.log("userId in socketClient : ", userId)
        // this.socket = socketIOClient(BASE_URL);
        // this.userId = userId
    }

    createNewMessge({ userId, channelId, message }) {
        if (!userId || !channelId || !message) {
            return
        }
        console.log("channelId in client ", channelId)
        var msg = {
            userId,
            channelId,
            message
        }
        console.log("msg : ", msg)
        this.socket.emit('chat-message', msg);
    }

    // listenToChannel(channelId, callback) {
    //     alert("befor statign lsten : ", channelId)
    //     console.log("befor statign lsten : ", channelId)
    //     this.socket.emit('subscribe', (data) => {
    //         alert("Data : ", data)
    //         // callback()
    //     });
    // }

    getCurrentChannel() {

    }

    isAlreadyListening(channelId) {
        var alreadyExist = false
        this.events.notification.forEach((c) => {
            if (c === channelId) {
                alreadyExist = true
                return true
            }
        })
        return alreadyExist
    }

    joinNotification(channelId, callback) {
        if (!this.isAlreadyListening(channelId)) {
            this.socket.emit('subscribe', channelId);
            this.events.notification.push(channelId)
            console.log("listening to : ", `${channelId}-notification`)
            this.socket.on(`${channelId}-notification`, (payload) => {
                // alert("got it")
                console.log("payload : ", payload)
                callback(payload.channelId)
            })
            this.events.notification.push(channelId)
        }


    }

    // joinNotification(channelId, callback) {
    //     this.socket.emit('subscribe', channelId);
    //     if (!isAlreadyListening(channelId)) {
    //         this.events.notification.push(channelId)

    //         this.events.channels.map(c => {
    //             this.socket.off(c)
    //         })

    //         console.log("befor starting channel update : ", `${channelId}-update`)
    //         this.socket.on(`${channelId}-update`, (payload) => {
    //             console.log("channelId on udpae", channelId)
    //             console.log("payload  on udpae", payload)
    //             callback(channelId)
    //         })
    //     }
    // }

    joinChannel(channelId, callback) {
        this.socket.emit('subscribe', channelId);

        this.events.channels.map(c => {
            this.socket.off(c)
        })

        console.log("befor starting channel update : ", `${channelId}-update`)
        this.socket.on(`${channelId}-update`, (payload) => {
            console.log("channelId on udpae", channelId)
            console.log("payload  on udpae", payload)
            callback(channelId)
        })
        this.events.channels.push(`${channelId}-update`)
    }



}

const socketClient = new socketClientClass();
export default socketClient
