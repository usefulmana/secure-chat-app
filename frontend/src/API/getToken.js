
const getToken = () => {
    var token = undefined
    if (JSON.parse(localStorage.getItem('jwt'))) {
        token = JSON.parse(localStorage.getItem('jwt')).token
    }

    return token
}

export default getToken