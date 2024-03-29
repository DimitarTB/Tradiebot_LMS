import { current } from "@reduxjs/toolkit"
import React, { useEffect, Fragment } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllCourses } from "../../redux/Courses/CoursesActions"
import { fetchAll } from "../../redux/Users/UserActions"
import { NavLink, Redirect } from "react-router-dom"

import Container from "../Global/Container"
import CourseCard from "./CourseCard"
import "./enrolled.css"

const EnrolledCourses = props => {

    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.user)

    const coursesSelector = useSelector(state => state.courses)
    const allCourses = coursesSelector?.allCourses?.filter(crs => currentUser?.currentUserData?.createdCourses?.includes(crs?._id))


    useEffect(() => {
        dispatch(getAllCourses(currentUser.currentUser))
        dispatch(fetchAll(currentUser.currentUser))
    }, [])

    return currentUser.currentUser !== null ? (
        <Container
            details="Created Courses"
            description="View your created courses."
            component={(
                <div id="enrolled">
                    {allCourses.map(course => <CourseCard course={course} edit={true} />)}
                </div>
            )}
        />
    ) : <Redirect to="/" />
}


export default EnrolledCourses