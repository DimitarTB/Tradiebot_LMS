import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, Redirect } from 'react-router-dom'
import { FILES_URL } from '../../redux/constants'
import { enrollCourse } from '../../redux/Users/UserActions'
import { unEnrollCourse } from '../../redux/Users/UserActions'

import "./CourseCard.css"

export default props => {

    const currentUser = useSelector(state => state.user)
    const users = currentUser.allUsers
    const dispatch = useDispatch()

    const _users = users.length > 3 ? users.filter(user => props.course.teachers.includes(user._id)) : []
    let teachers = ""

    for (const _user of _users) {
        if (_user !== _users[0]) teachers += ", " + _user.username
        else teachers += _user.username
    }

    return (
        <div className="course-card">
            <NavLink to={"/course/" + props.course._id}>
                <img src={FILES_URL + props.course.thumbnail} />
                <h3>{props.course.name}</h3>
            </NavLink>
            <p>{props.course.description}</p>
            <p>Teachers : {teachers}</p>

            {props.enroll === true ? 
                <button id="enroll" onClick={e => {
                    
                    const data = {
                        "username": currentUser.currentUserData.username,
                        "token": currentUser.currentUser,
                        "course_id": props.course._id
                    }
                    dispatch(enrollCourse(data))
                    alert("Course enrolled!")
                }
                }>Enroll</button> : ""
            }
            {props.unenroll === true ? 
            <button id="enroll" onClick={e => {
                    
                const data = {
                    "username": currentUser.currentUserData.username,
                    "token": currentUser.currentUser,
                    "course_id": props.course._id
                }
                dispatch(unEnrollCourse(data))
                alert("Course unenrolled!")
            }
            }>Unenroll</button> : ""
            }
            {props.edit === true ? <NavLink to={"/courses/edit/" + props.course._id}><button>Edit Course</button></NavLink> : ""}
        </div>
    )
}