import React, { useEffect, useState } from "react"
import { GiHamburgerMenu } from "react-icons/gi"
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
            resetTimer()
        }

        function resetTimer() {
            clearTimeout(t);
            t = setTimeout(logout, 10000);  // time is in milliseconds (1000 is 1 second)
        }
    }

    useEffect(() => {
        idleTimer()
    }, [])
    return redirect === true ? <Redirect to="/mobile_nav" /> : (
        <div className="container">
            <div className="details">
                <h1 id="det">{props.details}</h1>
                <h3 id="desc">{props.description}</h3>
                <div id="icon"><img src={process.env.PUBLIC_URL + "/Assets/icons/" + (props.icon ? props.icon : "book.png")} /></div>
            </div>

            {props.component}
            <div id="mobileNav">
                <GiHamburgerMenu id="icn" onClick={() => setRedirect(true)} />
            </div>
        </div>
    )
}


export default Container