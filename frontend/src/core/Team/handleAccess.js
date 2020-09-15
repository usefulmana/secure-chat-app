

var userId = undefined
if (JSON.parse(localStorage.getItem('jwt'))) {
    userId = JSON.parse(localStorage.getItem('jwt')).user._id;
}

export const isUserHasAccessToThisChannel = (channel) => {
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

        return false
    }
}

export const isUserInThisTeam = (team) => {
    var access = false
    team.members.forEach(m => {
        console.log("userId : ", userId, " m : ", m)

        if (m === userId) {
            access = true
        }
    })
    return access
}

