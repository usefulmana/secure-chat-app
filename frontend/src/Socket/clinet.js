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

    sendTestMessage() {
        this.socket.emit('test', 'hey can you hear me');
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
        console.log("msg : ", msg)
        this.socket.emit('chat-message', msg);
    }

}

const socketClient = new socketClientClass();
export default socketClient
