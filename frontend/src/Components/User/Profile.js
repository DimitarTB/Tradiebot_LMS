import React, { useState } from 'react'
import Container from "../Global/Container"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { FILES_URL, API_URL } from "../../redux/constants"
import axios from 'axios'
import { profilePicture } from '../../redux/Users/UserActions'

function Profile() {
    const propUser = useParams().username
    const currentUser = useSelector(state => state.user)
    const dispatch = useDispatch()

    return (
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
                </div>

                : <h1>Public info</h1>}>
        </Container>
    )
}

export default Profile
