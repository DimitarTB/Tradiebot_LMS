import React from "react"
import { GiHamburgerMenu } from "react-icons/gi"
import { MdKeyboardArrowDown } from 'react-icons/md'
import { FaUserAlt } from "react-icons/fa"
import { useSelector } from "react-redux"

import { NavLink } from "react-router-dom"

import "./Nav.css"

export default props => {

    const user = useSelector(state => state.user.currentUserData)

    const toggleNavItem = e => {
        let element = e.target
        while (element.classList.contains("nav-item") === false)
            element = element.parentNode
        element.classList.toggle("showing")
    }

    const toggleNav = e => {
        document.getElementsByClassName("nav-container")[0].classList.toggle("showing")
        if (document.getElementsByClassName("nav-container")[0].classList.contains("showing"))
            document.getElementsByClassName("App")[0].classList.add("showing")
        else
            document.getElementsByClassName("App")[0].classList.remove("showing")
    }

    return (
        <div className="nav-container">
            <div className="nav-body">
                <h1>Tradiebot LMS</h1>

                <div className="nav-item" onClick={e => toggleNavItem(e)} >
                    <span>
                        <span>
                            <FaUserAlt />
                            <h3>User</h3>
                        </span>
                        <MdKeyboardArrowDown />
                    </span>
                    <ul>
                        <li><NavLink to={"/user/" + user?._id}> Profile</NavLink></li>
                        <li><NavLink to="/logout"> Logout</NavLink></li>
                    </ul>
                </div>

                <div className="nav-item" onClick={e => toggleNavItem(e)} >
                    <span>
                        <span>
                            <FaUserAlt />
                            <h3>Courses</h3>
                        </span>
                        <MdKeyboardArrowDown />
                    </span>
                    <ul>
                        <li><NavLink to="/courses/enrolled"> Enrolled Courses</NavLink></li>
                        <li><NavLink to={"/courses/browse"}> Browse Courses</NavLink></li>
                        {user?.roles?.includes("Teacher") ? <li><NavLink to={"/courses/teaching"}> Teaching Courses</NavLink></li> : ""}
                        {user?.roles?.includes("SuperAdmin") ? <li><NavLink to={"/courses/created"}> Created Courses</NavLink></li> : ""}
                        <li><NavLink to="/logout"> Logout</NavLink></li>
                    </ul>
                </div>
            </div>
            <div className="toggler" onClick={e => toggleNav()}> <GiHamburgerMenu /> </div>
        </div>
    )
}