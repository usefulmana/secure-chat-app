import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import './Contact.scss'
import { login, authenticate } from '../API/userAPI'

const Contact = ({ visible }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));

    const [values, setValues] = useState({
 
    })

    useEffect(() => {

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


    return visible==='contact'&&(
      <div>
          Contact
      </div>
    )
}

export default Contact