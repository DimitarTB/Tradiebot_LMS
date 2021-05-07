import React, { useState, useEffect } from "react"

import Login from "./Login"

import "./Container.css"
import Register from "./Register"


export default props => {

    const [loginShowing, setLoginShowing] = useState(true)


    return (
        <div className="landing">
            <div className="landing-container">
                <div className="image">

                </div>
                {loginShowing === true ? <Login setLoginShowing={setLoginShowing} /> : <Register setLoginShowing={setLoginShowing} />}
            </div>
            <div className="landing-container-mobile">
                {loginShowing === true ? <Login setLoginShowing={setLoginShowing} /> : <Register setLoginShowing={setLoginShowing} />}
            </div>
        </div>
    )
}