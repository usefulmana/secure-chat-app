import { BASE_URL } from "../config";
const API = BASE_URL + '/api'

var token=undefined
if (JSON.parse(localStorage.getItem('jwt'))) {
    token = JSON.parse(localStorage.getItem('jwt')).token
}


export const createChannel = async ({ channelName, teamId }) => {
    return await fetch(`${API}/channel/create`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${token}`
        },
        body: JSON.stringify({ channelName, serverId: teamId })

    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};

export const editChannel = async ({ channelId, name }) => {
    return await fetch(`${API}/channel/${channelId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${token}`
        },
        body: JSON.stringify({ name })

    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};


export const deleteChannel = async ({ teamId, channelId }) => {
    console.log("before sending request : ", teamId , channelId)
    return await fetch(`${API}/channel/delete`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${token}`
        },
        body: JSON.stringify({channelId, serverId: teamId})

    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};