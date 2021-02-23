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
        console.log(user)
        dispatch(register(user))

        if (currentUser.registerStatus === "fulfilled") alert("A message with an activation link has been sent to your e-mail address!")
        else if (currentUser.registerStatus === "rejected") alert(currentUser.registerError)
    }
    return currentUser.currentUser === null ? (
        <div className="login form">
            <h3> REGISTER </h3>
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