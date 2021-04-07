import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import Container from '../Global/Container'

function ValidCertificate() {
    const course_id = useParams().course_id
    const user_id = useParams().user_id

    const course = useSelector(state => state.courses.allCourses.find(cr => cr._id === course_id))
    const user = useSelector(state => state.user.allUsers.find(usr => usr._id === user_id))


    return (
        <Container component={
            <div style={{ marginTop: "40px" }}>
                <h1>{"This is an official certificate that belongs to " + user.username + ", with official ID: " + user._id + ", for completing the course " + course.name + "."}</h1>
            </div>
        }>

        </Container>
    )
}

export default ValidCertificate
