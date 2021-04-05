import React, { useEffect, useState } from "react"
import { usew } from "react-redux"
import { Redirect } from "react-router-dom"
import "./Container.css"
const Container = props => {
    const [redirect, setRedirect] = useState(false)
    function idleTimer() {
        var t;
        //window.onload = resetTimer;
        window.onmousemove = resetTimer; // catches mouse movements
        window.onmousedown = resetTimer; // catches mouse movements
        window.onclick = resetTimer;     // catches mouse clicks
        window.onscroll = resetTimer;    // catches scrolling
        window.onkeypress = resetTimer;  //catches keyboard actions

        function logout() {
            console.log("inactive")
        }

        function resetTimer() {
            clearTimeout(t);
            t = setTimeout(logout, 10000);  // time is in milliseconds (1000 is 1 second)
        }
    }

    useEffect(() => {
        idleTimer()
    }, [])
    return redirect === true ? <Redirect to="/" /> : (
        <div className="container">
            <div className="details">
                <h1>{props.details}</h1>
                <h3 id="desc">{props.description}</h3>
                <div id="icon"><img src={process.env.PUBLIC_URL + "/Assets/icons/" + (props.icon ? props.icon : "book.png")} /></div>
            </div>

            {props.component}
        </div>
    )
}


export default Container