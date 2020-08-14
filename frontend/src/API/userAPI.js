import { BASE_URL } from "../config";
const API = BASE_URL + '/api'

export const currentUser = ({ token }) => {
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

// export const readTours = ({ limit = 20, token }) => {
//     return fetch(`${API}/tours?limit=${limit}`, {
//         method: "GET",
//         headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//         },
//     })
//         .then(response => {
//             return response.json();
//         })
//         .catch(err => console.log(err));
// };



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

export const deactivateAccount = ({ token, userId }) => {
    return fetch(`${API}/deactivate/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
        .then(data => {
            return data
        })
        .catch(err => console.log(err));
};

export const reactivateAccount = ({ token, userId }) => {
    return fetch(`${API}/reactivate/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
        .then(data => {
            return data
        })
        .catch(err => console.log(err));
};

export const createAccount = ({ token, userId, userInfo }) => {
    return fetch(`${API}/signup`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userInfo)
    })
        .then(data => {
            return data.json();
        })
        .catch(err => console.log(err));
};

// export const adminRoute=()=>{
//     console.log("adminroute function")
// }