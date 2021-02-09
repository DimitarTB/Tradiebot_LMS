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
    const allCourses = useSelector(state => state.courses)
    let enrolledCourses = allCourses.allCourses.filter(course => currentUser.currentUserData.enrolledCourses.includes(course._id))

    useEffect(() => {
        if (currentUser.currentUser !== null) {
            dispatch(getAllCourses(currentUser.currentUser))
            dispatch(fetchAll(currentUser.currentUser))
        }
    }, [])

    console.log(enrolledCourses)

    function getTeachers(course) {
        console.log(currentUser.allUsers)
        console.log(course.teachers)
        let teachers = currentUser.allUsers.filter(teacher => course.teachers.includes(teacher._id))
        console.log("Teachers:", teachers)
        return teachers
    }

    return (
        <Container
            details="Enrolled Courses"
            description="View your enrolled courses."
            component={(
                <div id="enrolled">
                    {enrolledCourses.map(course => <CourseCard course={course}/>)}
                </div>
            )}
        />
    )
}


export default EnrolledCourses