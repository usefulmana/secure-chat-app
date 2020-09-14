
import { BASE_URL } from "../config";
import token from "./getToken"
const API = BASE_URL + '/api'

export const getMessageFromChannel = async ({ channelId}) => {
    return await fetch(`${API}/chat/${channelId}?page=1&limit=100&sort=asc`, {
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