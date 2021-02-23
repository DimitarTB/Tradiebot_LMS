import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import "./Container.css"

function ChangePassword() {
    const [info, setInfo] = useState({
        username: ""
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
        var requestOptions = {
            method: 'POST',
            redirect: 'follow'
        };

        fetch("http://127.0.0.1:5000/api/temporary_password?user=" + info.username, requestOptions)
            .then(response => response.status === 200 ? setRedirect(true) : alert('User not found!'))
    }
    return redirect === false ? (
        <div className="landing">
            <div className="landing-container">
                <div className="image">
                    <div className="login form">
                        <h3> LOGIN </h3>
                        <form onChange={e => handleChange(e)} onSubmit={e => handleSubmit(e)}>
                            <label htmlFor="">Username or email</label>
                            <input type="text" name="username" />
                            <button> Submit </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    ) : <Redirect to="/" />
}

export default ChangePassword
