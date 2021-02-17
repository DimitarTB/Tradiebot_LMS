import React, { useEffect, Fragment, useState } from 'react'
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
    const [search, setSearch] = useState("")
    // const [showingCourses, setShowCourses] = useState([])
    
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
                <Fragment>
                    <input placeholder="Search" onChange={e => {
                        // setShowCourses([])
                        setSearch(e.target.value)
                        // console.log(showingCourses)
                        // {
                        //     <div id="enrolled">
                        //         {showCourses.map(course => course.name.includes(e.target.value) ? setShowCourses([...showingCourses, course]) : "")}
                        //     </div>
                        // }
                    }}></input>
                    {showCourses?.filter(course => course.name.toLowerCase().includes(search.toLowerCase())).map(course => <CourseCard course={course} enroll={true} />)}
                </Fragment>
            )}
        />
    )
}

export default BrowseCourses


