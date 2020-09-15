import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { register, authenticate } from '../../API/userAPI'
import Parallax from 'parallax-js' // Now published on NPM
import './base.scss'
import './SignUp.scss'
import queryString from 'query-string';

const SignUp = ({ history, visible, flipVisibility }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    if (jwt && jwt.token) {
        history.push('/teams/')
    }

    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        password2: "",
        error: "",
        loading: false,
    })

    const { username, email, password, password2, loading, error } = values;

    useEffect(() => {

    }, [])

    const handleChange = name => event => {
        setValues({ ...values, error: "", [name]: event.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!passwordCheck()) return false
        console.log({ username, email, password })
        register({ username, email, password }).then(
            data => {
                console.log("data : ", data)
                if (data.error) {
                    setValues({ ...values, error: data.error })
                }
                else {
                    authenticate(data, () => {
                        history.push('/teams/')
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

    const isFilled = (option) => {
        if (values[option] !== '') {
            return 'label label-active'
        } else {
            return 'label'
        }
    }

    // const showerror = () => {
    //     var firstIndex = error[0]
    //     var errorMessage = ""
    //     console.log()
    //     if (firstIndex.email) {
    //         errorMessage = firstIndex.email
    //         console.log("1")

    //     } else if (firstIndex.password) {
    //         errorMessage = firstIndex.password
    //         console.log("2")

    //     } else if (firstIndex.username) {
    //         errorMessage = firstIndex.username
    //         console.log("3")

    //     }
    //     console.log("what is errormeeage : ", errorMessage)
    //     return errorMessage
    // }

    const passwordCheck = () => {
        if (password === password2) {
            return true
        } else {
            setValues({ ...values, error: "Please confirm your password" })
        }
    }

    const showForm = () => {
        return (
            <form onKeyDown={handleEnter} className={`signin-form `}>
                <div class="signin-header">
                    <div class="row justify-content-center ">
                        <img src="img/user.png" className="user-icon" />
                    </div>
                    <div className="">Sign Up</div>
                </div>
                <div class="signin-body">
                    <div class="my-form ">
                        <input type="email" class="my-form-input" onChange={handleChange('username')} />
                        <label data-error="wrong" className={isFilled("username")} for="Form-email1">Your username</label>
                    </div>
                    <div class="my-form ">
                        <input type="email" class="my-form-input" onChange={handleChange('email')} />
                        <label data-error="wrong" className={isFilled("email")} for="Form-email1">Your email</label>
                    </div>

                    <div class="my-form ">
                        <input type="password" class="my-form-input " onChange={handleChange('password')} />
                        <label className={isFilled("password")} data-error="wrong" for="Form-pass1">Your password</label>
                    </div>
                    <div class="my-form ">
                        <input type="password" class="my-form-input " onChange={handleChange('password2')} />
                        <label className={isFilled("password2")} data-error="wrong" for="Form-pass1">Confirm your password</label>
                    </div>
                    {error !== "" && (<div className="position-absolute showError ">{error}</div>)}
                    <div type="button" class="btn signin-button" onClick={handleSubmit}>Sign Up</div>

                </div>
                <div className="signin-footer">
                    <div className="text-center no-have-account">
                        Already have account?
                    </div>
                    <div className="text-center sign-up-link btn" onClick={flipVisibility}>
                        Sign In
                    </div>
                </div>
            </form>
        )
    }


    return visible === 1 && (
        <div className={`base-container signup-cont`}>
            {showForm()}
        </div>
    )
}

export default SignUp