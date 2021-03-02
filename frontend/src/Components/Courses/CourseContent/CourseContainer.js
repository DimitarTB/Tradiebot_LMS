import React, { useState, useEffect, Fragment } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getAllCourses, getOneCourse } from "../../../redux/Courses/CoursesActions"
import { getAllLectures, getCourseLectures, getOneLecture } from "../../../redux/Lectures/LecturesActions"

import VideoPlayer from "./VideoPlayer"
import VideoBrowser from "./VideoBrowser"
import CourseInfoSection from "./CourseInfoSection"


import "./CourseContainer.css"
import { getLectureComments } from "../../../redux/Comments/CommentsActions"

const CourseContainer = props => {

    function stopWatching() {
        dispatch({ type: 'user/stopWatching', payload: {"id": currentCourse._id} })
    }
    const params = useParams()
    const dispatch = useDispatch()

    const currentCourse = useSelector(state => state.courses.allCourses.find(course => course._id === params.course_id))
    const currentLectures = useSelector(state => state.lectures.allLectures.filter(lecture => lecture.course_id === params.course_id))
    const [selectedLecture, setSelectedLecture] = useState(currentLectures[0])

    window.addEventListener('locationchange', stopWatching, false)
    window.addEventListener("beforeunload", stopWatching, false);
    window.addEventListener("unload", stopWatching, false);
    useEffect(() => {
        console.log("changed")
        dispatch(getOneLecture({ "id": selectedLecture?._id }))
        dispatch(getLectureComments({ "lecture_id": selectedLecture?._id }))
    }, [selectedLecture])


    useEffect(() => {
        dispatch({ type: 'user/startWatching', payload: { id: currentCourse._id } })
        dispatch(getCourseLectures({ "course_id": params.course_id }))
        const data = { "id": params.course_id, "tracking": true }
        dispatch(getOneCourse(data))
        dispatch(getLectureComments({ "lecture_id": selectedLecture?._id }))


        return () => stopWatching()
    }, [])

    return currentLectures.length > 0 ? (
        <div className="course-container">
            <div className="left">
                <VideoPlayer url={selectedLecture?.video_file} />
                <CourseInfoSection lecture={selectedLecture} course={currentCourse} />
            </div>
            <VideoBrowser lectures={currentLectures} setSelectedLecture={setSelectedLecture} currentCourse={currentCourse} />
        </div>
    ) : <div><center><h3>This course has no lectures in it !</h3></center></div>

}

export default CourseContainer
