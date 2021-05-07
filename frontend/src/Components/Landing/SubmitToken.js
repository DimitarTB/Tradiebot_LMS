import React, { useState } from 'react'
import { NavLink, Redirect } from 'react-router-dom'
import { API_URL } from '../../redux/constants'
import "./Container.css"

function SubmitToken() {
    const [info, setInfo] = useState({
        username: "",
        token: "",
        password: ""
    })
    const [redirect, setRedirect] = useState(false)
    const handleChange = e => {
        setInfo({
            ...info,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = e => {
        e.preventDefault();
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ "username": info.username, "password": info.password, "token": info.token });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(API_URL + "/api/change_password_token", requestOptions)
            .then(response => {
                if (response.status === 200) {
                    alert("Password changed successfully!")
                    setRedirect(true)
                }
                else {
                    alert("Invalid token or username!")
                }
            })
    }
    return redirect === false ? (
        <div className="landing">
            <div className="landing-container">
                <div className="image"></div>
                <div className="login form">
                    <form onChange={e => handleChange(e)} onSubmit={e => handleSubmit(e)}>
                        <h2>Change your password using a token we have sent to your e-mail.</h2>
                        <h2>If you can't find the e-mail, please request a new token, using <NavLink to="/change_password">Forgot Password</NavLink>.</h2>
                        <label htmlFor="">Username</label>
                        <input type="text" name="username" />
                        <label htmlFor="">Token</label>
                        <input type="text" name="token" />
                        <label htmlFor="">New Password</label>
                        <input type="password" name="password" />
                        <button> Submit </button>
                    </form>
                </div>

            </div>
            <div className="landing-container-mobile">
                <div className="image"></div>
                <div className="login form">
                    <form onChange={e => handleChange(e)} onSubmit={e => handleSubmit(e)}>
                        <h2>Change your password using a token we have sent to your e-mail.</h2>
                        <h2>If you can't find the e-mail, please request a new token, using <NavLink to="/change_password">Forgot Password</NavLink>.</h2>
                        <label htmlFor="">Username</label>
                        <input type="text" name="username" />
                        <label htmlFor="">Token</label>
                        <input type="text" name="token" />
                        <label htmlFor="">New Password</label>
                        <input type="password" name="password" />
                        <button> Submit </button>
                    </form>
                </div>

            </div>
        </div>
    ) : <Redirect to="/" />
}

export default SubmitToken
