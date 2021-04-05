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
    const allUsers = useSelector(state => state.user.allUsers)
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
                    <input id="ip" placeholder="Search.."
                        onChange={(e) => setSearch(e.target.value)}
                    ></input>
                    {showUsers.map(user => {
                        return (
                            <div className="course-card">
                                <NavLink to={"/user/" + user._id}>
                                    <img src={FILES_URL + user.profile_picture} />

                                    <h3>{user.username}</h3>
                                    <h5>{user._id}</h5>
                                </NavLink>
                                <h6 style={{ cursor: "pointer" }} onClick={(e) => {
                                    navigator.clipboard.writeText(user._id)
                                    alert("ID copied to clipboard!")
                                }}>Copy ID</h6>
                                <h4>{user.email}</h4>
                                {check_roles(user?.types)}
                            </div>)
                    })}
                </div>
            )}
        />
    )
}

export default SearchUsers
