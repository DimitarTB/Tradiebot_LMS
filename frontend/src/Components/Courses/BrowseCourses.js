import React, { useEffect, Fragment, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import CourseCard from "./CourseCard"
import "./enrolled.css"
import Container from "../Global/Container"
import { getAllCourses } from "../../redux/Courses/CoursesActions"
import { fetchAll } from '../../redux/Users/UserActions'


function BrowseCourses() {
    const allCourses = useSelector(state => state.courses.allCourses)

    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.user)
    const showCourses = allCourses
    const [search, setSearch] = useState("")
    // const [showingCourses, setShowCourses] = useState([])
    console.log(showCourses)

    useEffect(() => {
        if (currentUser.currentUser !== null) {
            dispatch(fetchAll(currentUser.currentUser))
            dispatch(getAllCourses(currentUser.currentUser))
        }
    }, [])


    return (
        <Container
            details="Search Courses"
            description="Discover courses"
            component={(

                <div id="enrolled">
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
                    {showCourses?.filter(course => course?.name?.toLowerCase()?.includes(search?.toLowerCase())).map(course => <CourseCard course={course} enroll={true} />)}
                </div>
            )}
        />
    )
}

export default BrowseCourses