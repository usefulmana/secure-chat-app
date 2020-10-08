import { BASE_URL } from "../config";
import { getToken, getUserId } from './getToken'

const API = BASE_URL + '/api'

// ** Social Auth Routes **
// router.get('/google', passport.authenticate('google'));
// router.get('/facebook', passport.authenticate('facebook', {scope: 'email'}));

// // ** Social Auth Callbacks **
// router.get('/google/redirect', passport.authenticate('google', {failureRedirect: '/login'}), socialAuthActions.google);
// router.get('/facebook/redirect', passport.authenticate('facebook'), socialAuthActions.facebook);

export const OAuthSignIn = (option) => {
    return `${API}/auth/${option}`
};

export const facebookSignin = () => {
    var token = getToken()

    return fetch(`${API}/facebook`, {
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