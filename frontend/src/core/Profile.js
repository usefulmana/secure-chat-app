import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import './Profile.scss'
import { login, authenticate, currentUser } from '../API/userAPI'

const Profile = ({ history }) => {
  var jwt = JSON.parse(localStorage.getItem("jwt"));
  var token = undefined

  if (!jwt) {
    history.push('/')
  } else {
    token = jwt.token
  }

  const [user, setUser] = useState({})

  useEffect(() => {
    console.log("toekn : ", token)
    currentUser({ token }).then((data) => {
      setUser(data)
    }).catch((err) => {

    })
  }, [])

  // const handleChange = name => event => {
  //     setValues({ ...values, errors: [], [name]: event.target.value });
  // };

  // const handleSubmit = (e) => {
  //     e.preventDefault()
  //     login({ email, password }).then(
  //         data => {
  //             if (data.errors) {
  //                 setValues({ ...values, errors: data.errors })
  //             }
  //             else {
  //                 authenticate(data, () => {
  //                     history.push('/dashboard/locations')
  //                 });
  //             }
  //         })
  // }

  return (
    <div>
      {JSON.stringify(user)}
    </div>
  )
}

export default Profile