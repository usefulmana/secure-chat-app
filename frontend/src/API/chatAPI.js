import { BASE_URL } from "../config";
const API = BASE_URL + '/api'

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
        body: JSON.stringify({name, description})

    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};