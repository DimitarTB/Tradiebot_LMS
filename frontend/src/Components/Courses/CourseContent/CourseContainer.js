import React, { useState, useEffect, Fragment } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getAllCourses } from "../../../redux/Courses/CoursesActions"
import { getAllLectures } from "../../../redux/Lectures/LecturesActions"

import VideoPlayer from "./VideoPlayer"
import VideoBrowser from "./VideoBrowser"
import CourseInfoSection from "./CourseInfoSection"

import "./CourseContainer.css"

const CourseContainer = props => {

    const   params = useParams()
    const dispatch = useDispatch()

    const currentUser = useSelector((state) => state.user)
    const currentCourse = useSelector(state => state.courses.allCourses.find(course => course._id === params.course_id))
    const currentLectures = useSelector(state => state.lectures.allLectures.filter(lecture => lecture.course_id === params.course_id))

    const [selectedLecture, setSelectedLecture] = useState(currentLectures[0])

    useEffect(() => {
        console.log("changed")
    }, [selectedLecture])


    useEffect(() => {
        dispatch(getAllCourses(currentUser.currentUser))
        dispatch(getAllLectures(currentUser.currentUser))
    }, [])

    return (
        <div className="course-container">
            <div className="left">
                <VideoPlayer lecture={selectedLecture} />
                <CourseInfoSection lecture={selectedLecture} course={currentCourse} />
            </div>
            <VideoBrowser lectures={currentLectures} setSelectedLecture={setSelectedLecture} />
        </div>
    )
    
}

export default CourseContainer
