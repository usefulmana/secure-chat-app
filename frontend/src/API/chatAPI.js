import { BASE_URL } from "../config";
const API = BASE_URL + '/api'

export const getChatInfo = async ({ token, chatId }) => {
    return await fetch(`${API}/server/${chatId}`, {
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


export const createChat = async ({ token, name, description }) => {
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