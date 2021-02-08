import React, { useState, useEffect } from "react"

import Login from "./Login"

import "./Container.css"


export default props => {

    const [loginShowing, setLoginShowing] = useState(true)


    return (
        <div className="landing">
            <div className="landing-container">
                <div className="image">

                </div>
                {loginShowing === true ? <Login /> : "Reigster new user"}
            </div>
        </div>
    )
}