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
    const allCourses = useSelector(state => state.courses.allCourses?.filter(course => (currentUser.currentUserData.createdCourses.includes(course?._id))))

    useEffect(() => {
        console.log(currentUser.currentUser)
        if (currentUser.currentUser !== null) {
            dispatch(getAllCourses(currentUser.currentUser))
            dispatch(fetchAll(currentUser.currentUser))
        }
    }, [])


    return (
        <Container
            details="Created Courses"
            description="View your created courses."
            component={(
                <div id="enrolled">
                    {allCourses.map(course => <CourseCard course={course} edit={true} />)}
                </div>
            )}
        />
    )
}


export default EnrolledCourses