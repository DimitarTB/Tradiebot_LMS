import React from 'react'
import Container from "../Global/Container"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"

function Profile() {
    const propUser = useParams().username
    const currentUser = useSelector(state => state.user)

    return (
        <Container details="Profile" description="" component={currentUser.currentUserData?._id === propUser ? <h1>Private info</h1> : <h1>Public info</h1>}>

        </Container>
    )
}

export default Profile
