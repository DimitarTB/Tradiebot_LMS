import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { NavLink } from 'react-router-dom'
import { FILES_URL } from '../../redux/constants'
import { fetchAll } from '../../redux/Users/UserActions'
import Container from '../Global/Container'
import "../Courses/CourseCard.css"
import "./grid.css"
import { Fragment } from 'react'

function SearchUsers() {
    const userSelector = useSelector(state => state.user)
    const allUsers = userSelector.allUsers
    const dispatch = useDispatch()
    const [search, setSearch] = useState("")
    useEffect(() => {
        dispatch(fetchAll("a"))
    }, [])

    const check_roles = (types) => {
        if (types?.includes("SuperAdmin")) {
            if (types?.includes("Teacher")) {
                return (<Fragment><h5>SuperAdmin</h5><h5>Teacher</h5></Fragment>)
            }
            else {
                return (<h5>SuperAdmin</h5>)
            }
        }
        else if (types?.includes("Teacher")) {
            return (<h5>Teacher</h5>)
        }
        else {
            return (<h5>Student</h5>)
        }
    }
    const showUsers = allUsers.filter(usr => usr.username.includes(search))
    return (
        <Container
            icon="user.png"
            details="Browse Users"
            component={(
                <div id="enrolled">
                    <input style={{
                        padding: "10px",
                        marginBottom: "20px",
                        fontSize: "1.1em",
                        border: "2px solid var(--gray)",
                        borderRadius: ".25rem",
                        color: "var(--gray)",
                    }} id="ip" placeholder="Search.."
                        onChange={(e) => setSearch(e.target.value)}
                    ></input>
                    {showUsers.map(user => {
                        return (
                            <div className="course-card">
                                <NavLink style={{ color: "#69707a" }} to={"/user/" + user._id}>
                                    <img src={FILES_URL + user.profile_picture} />
                                    <h3 style={{ color: "#212832" }}>{user.username}</h3>
                                    <h5 style={{ color: "#363d47" }}>{"ID: " + user._id}</h5>
                                </NavLink>
                                <h6 style={{ cursor: "pointer", color: "--var(grey)" }} onClick={(e) => {
                                    navigator.clipboard.writeText(user._id)
                                    alert("ID copied to clipboard!")
                                }}>Copy ID</h6>
                                <h4>{user.email}</h4>
                                {check_roles(user?.types)}
                                {userSelector.currentUserData.types.includes("SuperAdmin") ? <h5>{"Activated: " + (user?.activated === true ? "True" : "False")}</h5> : null}
                            </div>)
                    })}
                </div>
            )}
        />
    )
}

export default SearchUsers
