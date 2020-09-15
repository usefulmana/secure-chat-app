import { BASE_URL } from "../config";
const API = BASE_URL + '/api'


var token = undefined
if (JSON.parse(localStorage.getItem('jwt'))) {
    token = JSON.parse(localStorage.getItem('jwt')).token
}

export const currentUser = () => {
    var token = JSON.parse(localStorage.getItem('jwt')).token
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
        next();
    }
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

export const isAuthenticated = async () => {
    if (typeof window == "undefined") {
        return false;
    }
    if (localStorage.getItem("jwt")) {
        return JSON.parse(localStorage.getItem("jwt"));
        // await currentUser().then((data) => {
        //     // success case
        //     if (data) {
        //         return JSON.parse(localStorage.getItem("jwt"));

        //     } else {
        //         // Outdated token case
        //         localStorage.removeItem("jwt")
        //         return false
        //     }
        // })
    } else {
        return false;
    }
};

export const findUser = ({ method, keyword }) => {
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