import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { NavLink } from 'react-router-dom'
import { FILES_URL } from '../../redux/constants'
import { fetchAll } from '../../redux/Users/UserActions'
import Container from '../Global/Container'
import "../Courses/CourseCard.css"
import "./grid.css"

function SearchUsers() {
    const allUsers = useSelector(state => state.user.allUsers)
    const dispatch = useDispatch()
    const [search, setSearch] = useState("")
    useEffect(() => {
        dispatch(fetchAll("a"))
    }, [])

    const showUsers = allUsers.filter(usr => usr.username.includes(search))
    return (
        <Container
            details="Browse Users"
            component={(
                <div className="search-users-container">
                    <input id="ip" placeholder="Search.."
                        onChange={(e) => setSearch(e.target.value)}
                    ></input>
                    <div className="grid">
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
                                    {user.types.map(tp => <h5>{tp}</h5>)}
                                </div>)
                        })}
                    </div>
                </div>
            )}
        />
    )
}

export default SearchUsers
