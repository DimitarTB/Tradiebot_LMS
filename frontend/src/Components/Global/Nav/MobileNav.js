import React, { useState } from "react"
import { GiHamburgerMenu } from "react-icons/gi"
import { MdKeyboardArrowDown } from 'react-icons/md'
import { FaUserAlt } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { withRouter } from 'react-router-dom'

import { NavLink, Redirect } from "react-router-dom"

import "./Nav.css"

function MobileNav(props) {
    const dispatch = useDispatch()

    const user = useSelector(state => state.user.currentUserData)

    const [redirect, setRedirect] = useState(false)
    const toggleNavItem = e => {
        let element = e.target
        while (element.classList.contains("mobile-nav-item") === false)
            element = element.parentNode
        element.classList.toggle("showing")
    }


    return redirect === true ? <Redirect to="/" /> : (
        <div className="mobile-nav-container">
            <div className="mobile-nav-body">
                <h1>Tradiebot LMS</h1>

                {user?.types?.includes("SuperAdmin") ? <div className="mobile-nav-item" onClick={e => toggleNavItem(e)}>
                    <span>
                        <span>
                            <FaUserAlt />
                            <h3>Admin Panel</h3>
                        </span>
                        <MdKeyboardArrowDown />
                    </span>
                    <ul>
                        {user?.types?.includes("SuperAdmin") ? <li><NavLink to={"/courses/created"}> Created Courses</NavLink></li> : ""}
                        {user?.types?.includes("SuperAdmin") ? <li><NavLink to={"/courses/create"}> Create a Course</NavLink></li> : ""}
                        {user?.types?.includes("SuperAdmin") ? <li><NavLink to={"/teachers"}> Teachers</NavLink></li> : ""}
                        {user?.types?.includes("SuperAdmin") ? <li><NavLink to={"/courses_tracking"}> Courses Tracking</NavLink></li> : ""}
                        {user?.types?.includes("SuperAdmin") ? <li><NavLink to={"/quizzes_tracking"}> Quiz Records</NavLink></li> : ""}
                    </ul>
                </div> : null}
                <div className="mobile-nav-item" onClick={e => toggleNavItem(e)} >
                    <span>
                        <span>
                            <FaUserAlt />
                            <h3>User</h3>
                        </span>
                        <MdKeyboardArrowDown />
                    </span>
                    <ul>
                        <li><NavLink to={"/user/" + user?._id}> Profile</NavLink></li>
                        <li><NavLink to="/search_users"> Browse Users</NavLink></li>
                        <li><NavLink to="/my_certificates"> My Certificates</NavLink></li>
                        <li><p onClick={e => {
                            dispatch({ type: 'user/logout' })
                            // setRedirect("/logout")
                            setRedirect(true)
                        }} style={{ cursor: "pointer" }}> Logout</p></li>
                    </ul>
                </div>

                <div className="mobile-nav-item" onClick={e => toggleNavItem(e)}>
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
                        {user?.types?.includes("Teacher") ? <li><NavLink to={"/courses/teaching"}> Teaching Courses</NavLink></li> : ""}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default MobileNav
