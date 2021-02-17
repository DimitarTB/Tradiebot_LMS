import React, { useState, Fragment } from 'react'
import Container from "../../Components/Global/Container"
import { useDispatch, useSelector } from "react-redux"
import { createCourse } from '../../redux/Courses/CoursesActions'
import { API_URL } from "../../redux/constants"
import axios from "axios"
function CreateCourse() {
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.user)
    const courses = useSelector(state => state.courses)
    const [courseInfo, setCourseInfo] = useState({
        "name": "",
        "description": "",
        "teachers": "",
        "file": null
    })
    const setFile = e => {
        setCourseInfo({ "file": e[0] })
    }
    const handleChange = e => {
        setCourseInfo({
            ...courseInfo,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = e => {
        e.preventDefault();



        const data = {
            "name": courseInfo.name,
            "description": courseInfo.description,
            "teachers": courseInfo.teachers,
            "token": currentUser.currentUser,
            "username": currentUser.currentUserData.username,
            "manualEnroll": true
        }

        dispatch(createCourse(data))
    }
    return (
        <Container
            details="Create a new course"
            component={(
                <Fragment>
                    <form onChange={e => handleChange(e)} onSubmit={e => handleSubmit(e)}>
                        <input name="name" placeholder="Course Name"></input><br></br>
                        <input name="description" placeholder="Description"></input><br></br>
                        <input name="teachers" placeholder="Teacher"></input><br></br>
                        <button>Submit</button>
                    </form>
                </Fragment>
            )}
        />
    )
}

export default CreateCourse
