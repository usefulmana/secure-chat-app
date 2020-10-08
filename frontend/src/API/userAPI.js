import { BASE_URL } from "../config";
import { getToken, getUserId } from './getToken'

const API = BASE_URL + '/api'

export const currentUser = () => {
    var token = getToken()

    return fetch(`${API}/user/current`, {
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

export const register = user => {
    console.log("what is user : ", user)
    var token = getToken()

    return fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};

export const login = user => {
    var token = getToken()

    return fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};

export const changeUsername = ({ username, token }) => {
    var token = getToken()

    return fetch(`${API}/user/current`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${token}`
        },
        body: JSON.stringify({ username })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};

export const changePassword = ({ password, token }) => {
    var token = getToken()

    return fetch(`${API}/user/change-pw`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${token}`
        },
        body: JSON.stringify({ password })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};

export const changeAvatar = ({ formData, token }) => {
    var token = getToken()

    return fetch(`${API}/user/photo`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            // "Content-Type": "form-data",
            Authorization: `${token}`
        },
        body: formData
    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};



export const authenticate = (data, next) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("jwt", JSON.stringify(data));
    }
    next();
};

export const signout = next => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("jwt");
        next();
        return fetch(`${API}/signout`, {
            method: "GET"
        })
            .then(response => {
                console.log("signout", response);
            })
            .catch(err => console.log(err));
    }
};

export const isAuthenticated = () => {
    if (typeof window == "undefined") {
        return false;
    }

    if (localStorage.getItem("jwt")) {
        return JSON.parse(localStorage.getItem("jwt"));

    } else {
        return false;
    }
};

export const findUser = ({ method, keyword }) => {
    var token = getToken()

    return fetch(`${API}/user/search?${method}=${keyword}`, {
        method: "POST",
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

export const getUserById = ({ userId }) => {
    var token = getToken()

    return fetch(`${API}/user/${userId}`, {
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


export const forgotPassword = ({ email }) => {

    return fetch(`${API}/user/forgot-pw`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};


export const retrievePassword = ({ formData, token }) => {
    var token = getToken()

    return fetch(`${API}/user/retrieve-pw`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            // "Content-Type": "form-data",
            Authorization: `${token}`
        },
        body: formData
    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};