import { current } from "@reduxjs/toolkit"
import React, { useEffect, Fragment } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllCourses } from "../../redux/Courses/CoursesActions"
import { fetchAll } from "../../redux/Users/UserActions"
import { NavLink } from "react-router-dom"

import Container from "../Global/Container"
import CourseCard from "./CourseCard"
import "./enrolled.css"

const EnrolledCourses = props => {

    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.user)
    const allCourses = useSelector(state => state.courses.allCourses?.filter(course => course.teachers.includes(currentUser.currentUserData?._id)))

    useEffect(() => {
        if (currentUser.currentUser !== null) {
            dispatch(getAllCourses(currentUser.currentUser))
            dispatch(fetchAll(currentUser.currentUser))
        }
    }, [])


    return (
        <Container
            details="Teaching Courses"
            description="View your courses."
            component={(
                <div id="enrolled">
                    {allCourses.map(course => <CourseCard course={course} edit={true} />)}
                </div>
            )}
        />
    )
}


export default EnrolledCourses