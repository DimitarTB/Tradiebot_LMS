import React from "react"

import { useSelector, useDispatch } from "react-redux"

export default props => {

    return (
        <div className="login form">
            <h3> LOGIN </h3>
            <form>
                <label htmlFor="">Username or email</label>
                <input type="text" name="login" />

                <label htmlFor="password">Password</label>
                <input type="password" name="password" />

                <button> Login </button>
            </form>
        </div>
    )
}