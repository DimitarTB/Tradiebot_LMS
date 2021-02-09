import React from "react"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { loginUser } from "../../redux/Users/UserActions"
import { Redirect } from "react-router-dom"

export default props => {

    const dispatch = useDispatch()
    const [user, setUser] = useState({
        username: "",
        password: ""
    })

    const currentUser = useSelector((state) => state.user)

    const handleChange = e => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = e => {
        e.preventDefault();
        dispatch(loginUser(user))
        
    }
    return currentUser.currentUser === null ? (
        <div className="login form">
            <h3> LOGIN </h3>
            <form onChange={e => handleChange(e)} onSubmit={e => handleSubmit(e)}>
                <label htmlFor="">Username or email</label>
                <input type="text" name="username" />

                <label htmlFor="password">Password</label>
                <input type="password" name="password" />

                <button> Login </button>
            </form>
        </div>
    ) : <Redirect to="/home" />
}