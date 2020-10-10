

const getUserId = () => {
    if (JSON.parse(localStorage.getItem('jwt'))) {
        return JSON.parse(localStorage.getItem('jwt')).user._id;
    } else {
        return null
    }
}

export const isUserHasAccessToThisChannel = (channel) => {

    var userId = getUserId()

    console.log("channel : ", channel)
    console.log("userId : ", userId)
    if (!channel) return false;

    if (channel.isPrivate === false) {
        return true
    } else {
        var isMemberIn = false
        channel.members.map(m => {
            if (m === userId) {
                isMemberIn = true
            } else if (m._id === userId) {
                isMemberIn = true

            }
        })

        if (isMemberIn) {
            return true
        } else {
            return false
        }

    }
}

export const isUserInThisTeam = (team) => {
    var userId = getUserId()

    var access = false
    team.members.forEach(m => {

        if (m === userId) {
            access = true
        }
    })
    return access
}

