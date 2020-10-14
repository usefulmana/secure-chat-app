
// A Password Checking Function
// Minimum 8 characters
// Needs to contain at least 1 of each [a-z], [A-Z], [0-9], [@$!%*#?&]
const checkPassword = (password) => {

    // Minimum eight characters, at least one letter, one number and one special character
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

    return re.test(password);
}


module.exports = { checkPassword }