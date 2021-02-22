import React from "react"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { loginUser, register } from "../../redux/Users/UserActions"
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
        dispatch(register(user)) 
    }
    return currentUser.currentUser === null ? (
        <div className="login form">
            <h3> REGISTER </h3>
            <h4>{currentUser.registerStatus === "fulfilled" ? <div>An email has been sent with activation link!</div> : ""}</h4>
            <form onChange={e => handleChange(e)} onSubmit={e => handleSubmit(e)}>
                <label htmlFor="">Username</label>
                <input type="text" name="username" />

                <label htmlFor="">E-mail</label>
                <input type="email" name="email" />

                <label htmlFor="password">Password</label>
                <input type="password" name="password" />

                <button> Register </button>
            </form>
            <button onClick={e => props.setLoginShowing(true)}>Login</button>
        </div>
    ) : <Redirect to="/home" />
}