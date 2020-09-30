
export const getToken = () => {
    var token = undefined
    if (JSON.parse(localStorage.getItem('jwt'))) {
        token = JSON.parse(localStorage.getItem('jwt')).token
    }

    return token
}

export const getUserId = () => {
    var userID = undefined
    if (JSON.parse(localStorage.getItem('jwt'))) {
        userID = JSON.parse(localStorage.getItem('jwt')).user._id
    }

    return userID
}
