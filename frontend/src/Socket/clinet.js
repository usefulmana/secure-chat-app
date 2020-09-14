import socketIOClient from "socket.io-client";
import { BASE_URL } from "../config"


class socketClientClass {
    constructor() {
        // this.socket = undefined
        // this.userId = undefined
        this.socket = socketIOClient(BASE_URL);
        // this.userId = userId
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

    joinChannel(channelId) {
        console.log("befor statign lsten : ", channelId)
        this.socket.emit('subscribe', channelId);


    }

    listenToChannel(callback) {
        this.socket.on('update', (payload) => {
            // console.log("payload : ", payload)
            // alert(JSON.stringify(payload))
            callback()
            // alert("Dataawe : ", JSON.stringify(data))
        })
    }

}

const socketClient = new socketClientClass();
export default socketClient
