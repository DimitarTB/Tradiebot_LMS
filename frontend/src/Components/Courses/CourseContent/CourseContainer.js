import React, { useState, useEffect, Fragment } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getAllCourses, getOneCourse } from "../../../redux/Courses/CoursesActions"
import { getAllLectures, getCourseLectures, getOneLecture, watchedLecture } from "../../../redux/Lectures/LecturesActions"

import VideoPlayer from "./VideoPlayer"
import VideoBrowser from "./VideoBrowser"
import CourseInfoSection from "./CourseInfoSection"


import "./CourseContainer.css"
import { getLectureComments } from "../../../redux/Comments/CommentsActions"
import Container from "../../Global/Container"

const CourseContainer = props => {

    const [redirect, setRedirect] = useState(false)
    function idleTimer() {
        var t;
        //window.onload = resetTimer;
        window.onmousemove = resetTimer; // catches mouse movements
        window.onmousedown = resetTimer; // catches mouse movements
        window.onclick = resetTimer;     // catches mouse clicks
        window.onscroll = resetTimer;    // catches scrolling
        window.onkeypress = resetTimer;  //catches keyboard actions

        function logout() {
            console.log("inactive")
        }

        function resetTimer() {
            clearTimeout(t);
            t = setTimeout(logout, 10000);  // time is in milliseconds (1000 is 1 second)
        }
    }

    useEffect(() => {
        idleTimer()
    }, [])

    function stopWatching() {
        dispatch({ type: 'user/stopWatching', payload: { "id": currentCourse._id } })
    }
    const params = useParams()
    const dispatch = useDispatch()

    const currentCourse = useSelector(state => state.courses.allCourses.find(course => course._id === params.course_id))
    const currentLectures = useSelector(state => state.lectures.allLectures.filter(lecture => lecture.course_id === params.course_id))
    const [selectedLecture, setSelectedLecture] = useState(currentLectures[0])
    const currentUser = useSelector(state => state.user)

    window.addEventListener('locationchange', stopWatching, false)
    window.addEventListener("beforeunload", stopWatching, false);
    window.addEventListener("unload", stopWatching, false);
    useEffect(() => {
        if (currentUser.currentUserData.enrolledCourses.includes(currentCourse._id)) {
            console.log("changed")
            dispatch(getOneLecture({ "id": selectedLecture?._id }))
            dispatch(getLectureComments({ "lecture_id": selectedLecture?._id }))
            if (!(selectedLecture?.watchedBy.includes(currentUser.currentUserData._id))) {
                const data = {
                    "id": selectedLecture?._id
                }
                dispatch(watchedLecture(data))
            }
        }
    }, [selectedLecture])


    useEffect(() => {
        console.log(currentLectures)
        if (currentUser.currentUserData.enrolledCourses.includes(currentCourse._id)) {
            dispatch({ type: 'user/startWatching', payload: { id: currentCourse._id } })
            dispatch(getCourseLectures({ "course_id": params.course_id }))
            const data = { "id": params.course_id, "tracking": true }
            dispatch(getOneCourse(data))
            dispatch(getLectureComments({ "lecture_id": selectedLecture?._id }))


            return () => stopWatching()
        }
    }, [])

    return currentUser.currentUserData.enrolledCourses.includes(currentCourse._id) ? (currentLectures.length > 0 ? (
        <div className="course-container">
            <div className="left">
                <VideoPlayer url={selectedLecture?.video_file} />
                <CourseInfoSection lecture={selectedLecture} course={currentCourse} />
            </div>
            <VideoBrowser user_id={currentUser.currentUserData._id} lectures={currentLectures} setSelectedLecture={setSelectedLecture} currentCourse={currentCourse} />
        </div>
    ) : <div><center><h3>This course has no lectures in it !</h3></center></div>) : <Container
            details={currentCourse.name}
            description={currentCourse.description}
            component={<div><h2>Lectures:</h2>{currentLectures.map(lect => <h4>{lect.name}</h4>)}</div>}
        />

}

export default CourseContainer
