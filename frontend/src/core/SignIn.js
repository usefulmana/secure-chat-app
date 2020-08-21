import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import './Main.scss'
import { login, authenticate } from '../API/userAPI'
import Loader from './Loader'
import Parallax from 'parallax-js' // Now published on NPM
import anime from 'animejs';
import './SignIn.scss'
import queryString from 'query-string';

const SignIn = ({ history, visible, flipVisibility }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    if (jwt && jwt.token) {
        history.push('/dashboard/')
    }

    const [values, setValues] = useState({
        email: "",
        password: "",
        errors: [],
        loading: false,
    })
    const { email, password, loading, errors } = values;

    useEffect(() => {

    }, [])

    const handleChange = name => event => {
        setValues({ ...values, errors: [], [name]: event.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        login({ email, password }).then(
            data => {
                if (data.errors) {
                    setValues({ ...values, errors: data.errors })
                }
                else {
                    console.log("what is data after login is succesfull : " , data.user.servers)
                    authenticate(data, () => {
                        history.push(`/dashboard`)
                    });
                }
            })
    }

    const ValidateEmail = (mail) => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true)
        }
        return (false)
    }

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            if (ValidateEmail(email)) {
                handleSubmit(e)
            } else {
                setValues({ ...values, error: true })
            }
        }
    }

    const isFilled = () => {
        if (email !== '') {
            return 'label label-active'
        } else {
            return 'label'
        }
    }

    const showErrors = () => {
        var firstIndex = errors[0]
        var errorMessage = ""
        console.log()
        if (firstIndex.email) {
            errorMessage = firstIndex.email
            console.log("1")

        } else if (firstIndex.password) {
            errorMessage = firstIndex.password
            console.log("2")

        } else if (firstIndex.username) {
            errorMessage = firstIndex.username
            console.log("3")

        }
        console.log("what is errormeeage : ", errorMessage)
        return errorMessage
    }

    const showForm = () => {
        return (
            <form onKeyDown={handleEnter} className={`signin-form `}>
                <div class="signin-header">
                    <div class="row justify-content-center mr-3">
                        <img src="img/user.png" className="user-icon" />
                    </div>
                    <h3 class="" id="" ><strong>Sign in</strong></h3>
                </div>
                <div class="signin-body">

                    <div class="md-form ">
                        <input type="email" id="Form-email1" class="form-control " onChange={handleChange('email')} />
                        <label data-error="wrong" className={isFilled()} for="Form-email1">Your email</label>
                    </div>

                    <div class="md-form ">
                        <input type="password" id="Form-pass1" class="form-control " onChange={handleChange('password')} />
                        <label className={isFilled()} data-error="wrong" for="Form-pass1">Your password</label>
                    </div>
                    {errors.length > 0 && (<div className="position-absolute showError ">{showErrors()}</div>)}
                    <div class="row justify-content-center mr-3 mt-5">
                        <button type="button" class="signin-button" onClick={handleSubmit}>Sign in</button>
                    </div>
                    <div className="text-center my-4">
                        Have not had account yet?
                    </div>
                    <div className="text-center my-4 sign-up-link pointer" onClick={flipVisibility}>
                        Sign up
                    </div>
                </div>
            </form>
        )
    }

    return (
        <div className={`signin-container ${visible === 0 ? 'sign-in-slide-down' : "sign-in-slide-up"}`}>
            {showForm()}
        </div>
    )
}

export default SignIn