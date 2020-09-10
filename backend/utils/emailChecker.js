const checkEmail = (email) => {

    // Minimum eight characters, at least one letter, one number and one special character
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    return re.test(email);
}


module.exports = { checkEmail }