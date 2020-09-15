

var userId = undefined
if (JSON.parse(localStorage.getItem('jwt'))) {
    userId = JSON.parse(localStorage.getItem('jwt')).user._id;
}

const handleAccess = (channel) => {
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

export default handleAccess