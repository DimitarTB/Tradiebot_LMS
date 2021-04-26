import React, { useState, useEffect } from 'react'
import Container from "../Global/Container"
import { useDispatch, useSelector } from "react-redux"
import { Redirect, useParams } from "react-router-dom"
import { FILES_URL, API_URL } from "../../redux/constants"
import axios from 'axios'
import { changePassword, changeUsername, changeUserPassword, enrollUserCourse, fetchAll, getOneUser, profilePicture } from '../../redux/Users/UserActions'
import CourseCard from '../Courses/CourseCard'
import "../Courses/Forms/Edit.css"
import { Fragment } from 'react'

function Profile() {
    const propUser = useParams().username
    const currentUser = useSelector(state => state.user)
    const courses = useSelector(state => state.courses.allCourses)

    const selectedProfile = currentUser?.allUsers?.find(usr => usr?._id === propUser)

    const dispatch = useDispatch()

    const [password, setPassword] = useState({
        "currentPassword": "",
        "newPassword": ""
    })

    const [selected, setSelected] = useState("Profile Info")

    const [username, setUsername] = useState({
        "username": currentUser.currentUserData?.username,
        "email": currentUser.currentUserData?.email,
        "bio": currentUser.currentUserData?.bio
    })

    const [showState, setShowState] = useState(false)

    const [showUsernameState, setShowUserNameState] = useState(false)

    const passwordHandleChange = e => {
        setPassword({
            ...password,
            [e.target.name]: e.target.value
        })
    }

    const passwordHandleSubmit = e => {
        e.preventDefault();
        dispatch(changePassword(password))
        setShowState(true)
    }

    const usernameHandleChange = e => {
        setUsername({
            ...username,
            [e.target.name]: e.target.value
        })
    }

    const usernameHandleSubmit = e => {
        e.preventDefault();
        if (username.username === "") {
            username.username = currentUser.currentUserData.username
        }
        if (username.email === "") {
            username.email = currentUser.currentUserData.email
        }
        dispatch(changeUsername(username))
        console.log("username true")
        setShowUserNameState(true)
    }

    useEffect(() => {
        if (showState === true) {
            if (currentUser.changePasswordStatus === "fulfilled") {
                console.log("Fulfilled change_pwaq")
                alert("Password changed successfully!")
                setShowUserNameState(false)
            }
            else if (currentUser.changePasswordStatus === "rejected") {
                console.log("Rejected change_pwaq")
                alert("Passwords doesn't match!")
                setShowUserNameState(false)
            }
        }
    }, [currentUser.changePasswordStatus])

    useEffect(() => {
        if (showUsernameState === true) {
            if (currentUser.changeUsernameStatus === "fulfilled") {
                alert("Data updated successfully!")
                setShowState(false)
            }
            else if (currentUser.changeUsernameStatus === "rejected") {
                alert(currentUser.usernameError)
                setShowState(false)
            }
        }
    }, [currentUser.changeUsernameStatus])

    useEffect(() => {
        dispatch(fetchAll(""))
        dispatch(getOneUser(selectedProfile?.username))
    }, [])


    const check_roles = (types) => {
        if (types?.includes("SuperAdmin")) {
            if (types?.includes("Teacher")) {
                return (<Fragment><h4>SuperAdmin</h4><h4>Teacher</h4></Fragment>)
            }
            else {
                return (<h4>SuperAdmin</h4>)
            }
        }
        else if (types?.includes("Teacher")) {
            return (<h4>Teacher</h4>)
        }
        else {
            return (<h4>Student</h4>)
        }
    }

    return currentUser.currentUserData ? (
        <Container details="Profile" description="" icon={selectedProfile?.types.includes("Teacher") && currentUser.currentUserData?._id !== propUser ? "teacher.png" : "user.png"}
            component={currentUser.currentUserData?._id === propUser ?
                <div id="edit-quiz-container">
                    <div className="profile-picture">
                        <h3>Change your profile picture</h3>
                        {currentUser.currentUserData.profile_picture === "" ? "No profile picture" : <img id="pp" src={FILES_URL + currentUser.currentUserData.profile_picture} width="200" />}
                        <div className="topic">
                            <form
                                onSubmit={e => {
                                    e.preventDefault()
                                    dispatch(profilePicture({ "file": e.target.pp.files[0], "username": currentUser.currentUserData.username }))
                                }}>
                                {/* {currentUser.currentUserData.profile_picture === "" ? "No profile picture" : <img src={FILES_URL + currentUser.currentUserData.profile_picture} width="200" height="200" />} */}
                                <br /><input name="pp" type="file"></input>
                                <br /><button>Submit</button><br /><br />
                                {currentUser.profilePictureStatus === "pending" ? <h5>Uploading picture...</h5> : ""}
                            </form>
                        </div>
                    </div>
                    <div class="rest">
                        <div className="form_nav">
                            <ul>
                                <li id={selected === "Profile Info" ? "active" : ""} onClick={() => setSelected("Profile Info")}>Profile Info</li>
                                <li id={selected === "Security" ? "active" : ""} onClick={() => setSelected("Security")}>Security</li>
                            </ul>
                        </div>

                        {selected === "Profile Info" ?
                            <Fragment>
                                <form onChange={e => usernameHandleChange(e)} onSubmit={e => usernameHandleSubmit(e)}>
                                    <h3>Change your profile info</h3><br />
                                    <label for="username">Username</label><br />
                                    <input name="username" type="username" value={username.username}></input><br />
                                    <label for="email">E-mail</label><br />
                                    <input name="email" type="email" value={username.email}></input><br />
                                    <label for="bio">Biography</label><br />
                                    <textarea name="bio" value={username.bio} /><br />
                                    {currentUser.changePasswordStatus === "pending" ? <h4>Pending...</h4> : ""}
                                    <button type="submit">Submit</button>
                                </form>
                            </Fragment>
                            : null}
                        {selected === "Security" ?
                            <form onChange={e => passwordHandleChange(e)} onSubmit={e => passwordHandleSubmit(e)}>
                                <h3>Change your password</h3><br />
                                <label for="currentPassword">Current Password</label>
                                <input name="currentPassword" type="password" placeholder="Current password:"></input><br></br>
                                <label for="newPassword">New Password</label>
                                <input name="newPassword" type="password" placeholder="New Password"></input><br />
                                {currentUser.changePasswordStatus === "pending" ? <h4>Pending...</h4> : ""}
                                <button type="submit">Submit</button>
                            </form>
                            : null}
                    </div>
                </ div>

                :
                <Fragment>
                    <div className="profile-picture">
                        {/* Public info */}
                        <h1>Public info</h1>
                        {selectedProfile?.profile_picture === "" ? "No profile picture" : <img style={{ borderRadius: '5px' }} src={FILES_URL + selectedProfile?.profile_picture} width="20%" />}
                        <h4>{selectedProfile?.username}</h4>
                        <h4>{selectedProfile?.email}</h4>
                        {check_roles(selectedProfile?.types)}
                        <br /><br />
                        {selectedProfile?.bio !== "" ? <Fragment>
                            <h4>Biography</h4>
                            <p>{selectedProfile?.bio}</p>
                        </Fragment> : null}
                        <br />


                    </div>
                    {currentUser.currentUserData.types.includes("SuperAdmin") ?
                        <div id="edit-quiz-container">
                            <div className="topic">
                                <hr />
                                <h3>Change this user's password</h3>
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    dispatch(changeUserPassword({ "password": e.target.pw.value, "id": propUser }))
                                    alert("Password changed successfully!")
                                    e.target.pw.value = ""
                                }}>
                                    <input placeholder="Password" type="password" name="pw"></input>
                                    <button type="submit">Change</button>
                                </form>
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    dispatch(enrollUserCourse({ "user_id": selectedProfile._id, "course_id": e.target.id.value }))
                                    e.target.id.value = ""
                                }
                                }>
                                    <h3>Add user course</h3>
                                    <input name="id" placeholder="Course ID"></input>
                                    <button type="Submit">Add</button>
                                </form></div>
                            <div className="grid">
                                {courses.map(course => selectedProfile?.enrolledCourses.includes(course._id) ? <CourseCard course={course} admin={true} user_id={selectedProfile._id}></CourseCard> : null)}
                            </div>
                        </div>
                        : null}
                </Fragment>} />
    ) : <Redirect to="/" />
}

export default Profile