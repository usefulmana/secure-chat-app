import React, { useState, useEffect } from "react";
import './Main.scss'
import Loader from '../Loader'
import SignIn from '../Auth/SignIn'
import SignUp from "../Auth/SignUp";
import querySearch from "stringquery";
import { authenticate, currentUser } from "../../API/userAPI"

const Main = ({ history }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    if (jwt && jwt.token) {
        history.push('/teams')
    }

    const [values, setValues] = useState({
        email: "",
        password: "",
        error: "",
        loading: false,
    })

    // 0 for sign in and 1 for sign up
    const [visible, setVisible] = useState(0)
    const { email, password, loading, error } = values;

    useEffect(() => {
        var token = querySearch(history.location.search).token;
        if (token) {
            localStorage.setItem('jwt', JSON.stringify({token: `Bearer ${token}` }))
            currentUser().then(data => {
                if (data.errors || data.message) {

                } else {
                    var jwt = JSON.parse(localStorage.getItem('jwt'))
                    jwt.user = { ...data }
                    localStorage.setItem('jwt', JSON.stringify(jwt))
                    history.push('/teams')
                }
            }
            ).catch()
        }
    }, [])

    const flipVisibility = () => {
        if (visible === 1) {
            setVisible(0)
        } else {
            setVisible(1)
        }
    }

    return (
        <div className={`main-cont ${visible === 1 && 'main-cont-enlarged'} row `}>
            <div className="background-cont"></div>
            <div className="logo-cont row AIC">
                <i class="fab fa-rocketchat"></i>
                <img className="img" src={require('./img/test.png')} /> Chattr
            </div>
            <div className="text-cont">
                <div className="heading">
                    <div>Stay connected and organized. </div>
                    <div>Accomplish more together </div>
                    <div>across work, school, and life </div>
                    <div>with Chattr.</div>
                </div>
                <div className="border"></div>
                <div className="body">
                    <div>Chattr is a persistent chat-based collaboration</div>
                    <div>platform complete with document sharing,</div>
                    <div>online meetings, and many more extremely</div>
                    <div>useful features for business communications.</div>
                </div>
            </div>
            <SignIn visible={visible} flipVisibility={flipVisibility} history={history} />
            <SignUp visible={visible} flipVisibility={flipVisibility} history={history} />
            <Loader loading={loading} />
        </div>
    )
}

export default Main