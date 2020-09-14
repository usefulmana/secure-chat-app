var token = undefined
if (JSON.parse(localStorage.getItem('jwt'))) {
    token = JSON.parse(localStorage.getItem('jwt')).token
}

export default token