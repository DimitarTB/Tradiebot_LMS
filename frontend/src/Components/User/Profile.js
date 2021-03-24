import React, { useState, useEffect } from 'react'
import Container from "../Global/Container"
import { useDispatch, useSelector } from "react-redux"
import { Redirect, useParams } from "react-router-dom"
import { FILES_URL, API_URL } from "../../redux/constants"
import axios from 'axios'
import { changePassword, changeUsername, changeUserPassword, fetchAll, getOneUser, profilePicture } from '../../redux/Users/UserActions'

function Profile() {
    const propUser = useParams().username
    const currentUser = useSelector(state => state.user)

    const selectedProfile = currentUser?.allUsers?.find(usr => usr?._id === propUser)

    const dispatch = useDispatch()

    const [password, setPassword] = useState({
        "currentPassword": "",
        "newPassword": ""
    })

    const [username, setUsername] = useState({
        "username": currentUser.currentUserData?.username,
        "email": currentUser.currentUserData?.email
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
        console.log("username true2")
        if (showUsernameState === true) {
            console.log("username true3")
            if (currentUser.changeUsernameStatus === "fulfilled") {
                alert("Data updated successfully!")
                setShowState(false)
            }
            else if (currentUser.changeUsernameStatus === "rejected") {
                alert("Error: Please try again!")
                setShowState(false)
            }
        }
    }, [currentUser.changeUsernameStatus])

    useEffect(() => {
        dispatch(fetchAll(""))
        dispatch(getOneUser(selectedProfile?.username))
    }, [])

    return currentUser.currentUserData ? (
        <Container details="Profile" description=""
            component={currentUser.currentUserData?._id === propUser ?
                <div>
                    <h1>Private info</h1>
                    <form
                        onSubmit={e => {
                            e.preventDefault()
                            console.log(e.target.pp.files[0])
                            dispatch(profilePicture({ "file": e.target.pp.files[0], "username": currentUser.currentUserData.username }))
                        }}>
                        <br />
                        {currentUser.currentUserData.profile_picture === "" ? "No profile picture" : <img src={FILES_URL + currentUser.currentUserData.profile_picture} width="200" height="200" />}
                        <br /><input name="pp" type="file"></input>
                        <br /><button>Submit</button><br /><br />
                        {currentUser.profilePictureStatus === "pending" ? <h5>Uploading picture...</h5> : ""}
                        <hr /></form>

                    <form onChange={e => usernameHandleChange(e)} onSubmit={e => usernameHandleSubmit(e)}>
                        <h3>Change your username/email</h3>
                        <label for="username">Username</label><br />
                        <input name="username" type="username" value={username.username}></input><br />
                        <label for="email">E-mail</label><br />
                        <input name="email" type="email" value={username.email}></input><br />
                        {currentUser.changePasswordStatus === "pending" ? <h4>Pending...</h4> : ""}
                        <button type="submit">Submit</button>
                    </form><hr />
                    <form onChange={e => passwordHandleChange(e)} onSubmit={e => passwordHandleSubmit(e)}>
                        <h3>Change your password</h3>
                        <label for="currentPassword">Current Password</label><br />
                        <input name="currentPassword" type="password" placeholder="Current password:"></input><br />
                        <label for="newPassword">New Password</label><br />
                        <input name="newPassword" type="password" placeholder="New Password"></input><br />
                        {currentUser.changePasswordStatus === "pending" ? <h4>Pending...</h4> : ""}
                        <button type="submit">Submit</button>
                    </form><br /><hr />
                </div>

                : <div>
                    <h1>Public info</h1>
                    {selectedProfile?.profile_picture === "" ? "No profile picture" : <img src={FILES_URL + selectedProfile?.profile_picture} width="200" height="200" />}
                    <h3>{selectedProfile?.username}</h3>
                    <h3>{selectedProfile?.email}</h3>
                    {currentUser.currentUserData.types.includes("SuperAdmin") ?
                        <div>
                            <hr />
                            <h3>Change this user's password</h3>
                            <form onSubmit={(e) => {
                                e.preventDefault()
                                dispatch(changeUserPassword({ "password": e.target.pw.value, "id": propUser }))
                            }}>
                                <input placeholder="Password" name="pw"></input>
                                <button type="submit">Change</button>
                            </form>
                        </div>
                        : null}
                </div>}>
        </Container>
    ) : <Redirect to="/" />
}

export default Profile
