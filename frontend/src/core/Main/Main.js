import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import './Main.scss'
import { signin, authenticate } from '../../API/userAPI'
import Loader from '../Loader'
import SignIn from '../Auth/SignIn'
import SignUp from "../Auth/SignUp";


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
        // var parallax = new Parallax(document.getElementById('scene'))

        // anime({
        //     targets: '.morph',
        //     easing: 'easeInOutQuint',
        //     duration: 1000,
        //     loop: false,
        //     d: [
        //         {
        //             value: middleValue
        //         }

        //         // {
        //         //     value: "M0,0S35.68,426.3,270.517,423.268,414.871,297.2,590.707,297.2c106.908,0,277.86,195.024,310.862,194.475,84.187-1.4,283.11-278.521,469.674-281.556s126.164,323.813,272.15,378.21,240.9-18.452,265.62-31.059S1922.585,1080,1922.585,1080H0Z"
        //         // },
        //         // {value: "M0,1080s24.4-.675,254.065,0,145.874,0,321.71,0,233.022.586,322.1,0,194.1-.675,379.879,0,107.792-.586,258.4,0,217.906-.675,244.382,0,142.046,0,142.046,0H0Z" }
        //     ],
        // });
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