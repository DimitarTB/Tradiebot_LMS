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
    // const enrolledCourses = useSelector(state => state?.courses?.allCourses?.filter(course => state.user.currentUserData?.enrolledCourses?.includes(course._id)))
    const courses = useSelector(state => state.courses)
    const allCourses = courses.allCourses.msg ? [] : courses.allCourses.filter(course => currentUser?.currentUserData?.enrolledCourses?.includes(course?._id))

    useEffect(() => {
        if (currentUser.currentUser !== null) {
            dispatch(fetchAll(currentUser.currentUser))
            dispatch(getAllCourses(currentUser.currentUser))
        }
    }, [])

    // let enrolledCourses = allCourses.allCourses.filter(course => currentUser.currentUserData.enrolledCourses.includes(course._id))

    return (
        <Container
            details="Enrolled Courses"
            description="View your enrolled courses."
            component={(
                <div id="enrolled">
                    {allCourses.map(course => <CourseCard course={course} unenroll={true} />)}
                </div>
            )}
        />
    )
}


export default EnrolledCourses