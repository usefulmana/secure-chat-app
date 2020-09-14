import { BASE_URL } from "../config";
import token from "./getToken"
const API = BASE_URL + '/api'

// var token = undefined
// if (JSON.parse(localStorage.getItem('jwt'))) {
//     token = JSON.parse(localStorage.getItem('jwt')).token
// }

export const getTeamInfo = async ({ token, teamId }) => {
    return await fetch(`${API}/server/${teamId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};


export const createTeam = async ({ token, name, description }) => {
    return await fetch(`${API}/server/create`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${token}`
        },
        body: JSON.stringify({ name, description })

    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};


export const joinTeam = async ({ serverCode }) => {
    console.log("token ! : ", token)
    return await fetch(`${API}/server/join`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${token}`
        },
        body: JSON.stringify({ serverCode })

    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};

export const editTeam = async ({ teamId, name, description }) => {
    return await fetch(`${API}/server/${teamId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${token}`
        },
        body: JSON.stringify({ name, description })

    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};


export const deleteTeam = async ({ teamId }) => {
    return await fetch(`${API}/server/${teamId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${token}`
        },
        // body: JSON.stringify({name, description})

    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};


export const leaveTeam = async ({ serverId }) => {
    return await fetch(`${API}/server/leave`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${token}`
        },
        body: JSON.stringify({ serverId })

    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};


export const addMemberToTeam = async ({ userId, teamId }) => {
    console.log("token ! : ", token)
    return await fetch(`${API}/server/add`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${token}`
        },
        body: JSON.stringify({ userId, serverId: teamId })

    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};