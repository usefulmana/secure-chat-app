import React, { useState, useEffect } from "react";
import { login, authenticate, forgotPassword } from '../../API/userAPI'
import { OAuthSignIn } from '../../API/OAuthAPI'
import {Link} from 'react-router-dom';
import './base.scss'
import PasswordRule from "./PasswordRule";


const SignIn = ({ history, visible, flipVisibility }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    if (jwt && jwt.token) {
        history.push('/teams')
    }

    const [values, setValues] = useState({
        email: "",
        password: "",
        error: [],
        loading: false,
    })
    const { email, password, loading, error } = values;

    useEffect(() => {

    }, [])

    const handleChange = name => event => {
        setValues({ ...values, error: "", [name]: event.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        login({ email, password }).then(
            data => {
                console.log("data: ", data)
                if (data.error || data.message) {
                    setValues({ ...values, error: data.message })
                }
                else {
                    authenticate(data, () => {
                        history.push(`/teams`)
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


    const handleForgotPassword = () => {
        forgotPassword({ email }).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {

            }
        }).catch()
    }

    const showForm = () => {
        return (
            <form onKeyDown={handleEnter} className={`signin-form `}>
                <div class="signin-header">
                    <div class="row justify-content-center ">
                        <img src="img/user.png" className="user-icon" />
                    </div>
                    <div className="">Sign in</div>
                </div>
                <div class="signin-body">
                    {error !== "" && (<div className="position-absolute showError ">{error}</div>)}
                    <div class="my-form ">
                        <input type="email" class="my-form-input" onChange={handleChange('email')} />
                        <label data-error="wrong" className={isFilled("email")} for="Form-email1">Your email</label>
                    </div>
                    
                    <div class="my-form ">
                        <input type="password" class="my-form-input " onChange={handleChange('password')} />
                        <label className={isFilled("password")} data-error="wrong" for="Form-pass1">Your password</label>
                    </div>
                    
                    <div type="button" class="btn signin-button oauth-base" onClick={handleSubmit}>Sign in</div>
               
                    <div type="button" class="btn signin-button-google oauth-base" >
                        <a href={OAuthSignIn('google')}>
                            <i class="fa fa-google" aria-hidden="true"></i>Sign in with Google
                        </a>
                    </div>

                </div>
                <div className="signin-footer">
                    <PasswordRule/>
                    <div className="text-center no-have-account">
                        Have not had account yet?
                    </div>
                    <div className="text-center ">
                        <span className="sign-up-link btn" onClick={flipVisibility}>Sign up <span className="or-text">or</span></span>
                        
                        <Link to="fpw" className="forgot-password-link" >Forgot Password?</Link>
                    </div>

                </div>
            </form>
        )
    }

    return visible === 0 && (
        <div className={`base-container signin-cont `}>
            {showForm()}
        </div>
    )
}

export default SignIn