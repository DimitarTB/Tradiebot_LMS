import React from 'react'
import { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, Redirect } from 'react-router-dom'
import { FILES_URL } from '../../redux/constants'
import { enrollCourse, unenrollUserCourse } from '../../redux/Users/UserActions'
import { unEnrollCourse } from '../../redux/Users/UserActions'

import "./CourseCard.css"

export default props => {


    const currentUser = useSelector(state => state.user)
    const users = currentUser.allUsers
    const dispatch = useDispatch()
    // const currentTeachers = []
    // if (currentTeachers.includes(usr.username)) return
    // currentTeachers.push(usr.username)

    const _users = users.length > 0 ? users.filter(user => props.course.teachers.includes(user._id)) : []
    let teachers = () => {
        return (
            <Fragment>
                {
                    _users.map((usr, idx) => {
                        return (<NavLink to={"/user/" + usr._id}>{usr.username + " "}</NavLink>)
                    })
                }
            </Fragment>)
    }
    // for (const _user of _users) {
    //     if (_user !== _users[0]) teachers += ", " + _user.username
    //     else teachers += _user.username
    // }

    return (
        <div className="course-card">
            <NavLink style={{ color: "var(--grey)" }} to={"/course/" + props.course._id}>
                <img src={FILES_URL + props.course.thumbnail} />
                <h3 style={{ color: "var(--dark)" }}>{props.course.name}</h3>
                <h4>{"ID: " + props.course._id}</h4>
            </NavLink>
            <h5 style={{ cursor: "pointer" }} onClick={(e) => {
                navigator.clipboard.writeText(props.course._id)
                alert("ID copied to clipboard!")
            }}>Copy ID</h5>
            <p>Teachers : {teachers()}</p>

            {props.enroll === true && (props.course.manualEnroll === true || currentUser?.currentUserData?.types?.includes("SuperAdmin")) && !(currentUser.currentUserData.enrolledCourses.includes(props.course._id)) ?
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
            {props.admin === true ?
                <button id="enroll" onClick={() => dispatch(unenrollUserCourse({ "user_id": props.user_id, "course_id": props.course._id }))}>Unenroll User's Course</button>
                : null
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
            {props.edit === true || currentUser?.currentUserData?.types?.includes("SuperAdmin") || props.course.teachers.includes(currentUser.currentUserData._id) ? <NavLink to={"/courses/edit/" + props.course._id}>
                <button id={"edit"} className={(props.enroll === true && ((props.course.manualEnroll === true || currentUser?.currentUserData?.types?.includes("SuperAdmin"))) && !(currentUser.currentUserData.enrolledCourses.includes(props.course._id))) || props.unenroll === true || props.admin === true ? "" : "edit_enr"}>Edit Course</button>
            </NavLink> : ""}
        </div>
    )
}