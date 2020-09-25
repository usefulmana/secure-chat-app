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
        // this.socket = socketIOClient(BASE_URL);
        // this.userId = userId
    }

    createNewMessge({ userId, channelId, message }) {
        if (!userId || !channelId || !message) {
            return
        }
        var msg = {
            userId,
            channelId,
            message
        }
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
            this.socket.on(`${channelId}-notification`, (payload) => {
                // alert("got it")
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

        this.socket.on(`${channelId}-update`, (payload) => {
            callback(channelId)
        })
        this.events.channels.push(`${channelId}-update`)
    }

    isChannelOnCall(channelId, callback) {
        this.socket.emit('is-channel-on-call', channelId);

        this.socket.on(`channel-status`, (isOnline) => {
            callback(isOnline)
        })
    }

    listenChannelCall(channelId, callback) {
        this.socket.on(`receiving call`, (data) => {
            callback()
        })
    }

    initCallOnChannel(channelId) {
        this.socket.emit(`calling`, channelId)
    }

    listenCallFinish(callback) {
        this.socket.on(`call finished`, () => {
            callback()
        })
    }

}

const socketClient = new socketClientClass();
export default socketClient
