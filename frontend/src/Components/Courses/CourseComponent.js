import React, { useEffect } from 'react'
import Container from "../Global/Container"
import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { getAllCourses } from "../../redux/Courses/CoursesActions"
import { getAllLectures } from "../../redux/Lectures/LecturesActions"

function CourseComponent() {
    var course_id = useParams()
    const courses = useSelector((state) => state.courses)
    const currentUser = useSelector((state) => state.user)
    const lectures = useSelector((state) => state.lectures)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllCourses(currentUser.currentUser))
        dispatch(getAllLectures(currentUser.currentUser))
    }, [])

    course_id = course_id.course_id

    function course_filter(element) {
        return (element._id === course_id)
    }
    const currentCourse = courses.allCourses.find(course_filter)

    function lecture_filter(element) {
        return (element.course_id === course_id)
    }

    const courseLectures = lectures.allLectures.filter(lecture_filter)

    function getTeachers(course) {
        if (!course) {
            return []
        }
        let teachers = currentUser.allUsers.filter(teacher => course.teachers.includes(teacher._id))
        return teachers
    }

    return (
        // <Container
        //     details={currentCourse?.name}
        //     description={getTeachers(currentCourse).map((teacher, index, arr) => (teacher.username + ((index !== arr.length - 1) ? ", " : "")))}
        //     component={
        //         <div><center>
        //             <h1>{currentCourse?.name}</h1><h2>{currentCourse?.description}</h2><br></br>
        //             {courseLectures?.map(lect => (<h2>{lect?.name}</h2>))}
        //         </center></div>
        //     }
        // >
        // </Container>

        <div className="course-container">
            
        </div>

    )
}

export default CourseComponent
