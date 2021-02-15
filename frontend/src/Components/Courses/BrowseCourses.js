import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import CourseCard from "./CourseCard"
import "./enrolled.css"
import Container from "../Global/Container"
import { getAllCourses } from "../../redux/Courses/CoursesActions"

function BrowseCourses() {
    const allCourses = useSelector(state => state.courses.allCourses)

    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.user)
    const _showCourses = allCourses.filter(course => course.manualEnroll === true)
    const showCourses = _showCourses.filter(course => !(currentUser.currentUserData.enrolledCourses.includes(course._id)))

    useEffect(() => {
        if (currentUser.currentUser !== null) {
            dispatch(getAllCourses(currentUser.currentUser))
        }
    }, [])

    return (
        <Container
            details="Search Courses"
            description="Discover courses"
            component={(
                <div id="enrolled">
                    {showCourses.map(course => <CourseCard course={course} enroll={true} />)}
                </div>
            )}
        />
    )
}

export default BrowseCourses


