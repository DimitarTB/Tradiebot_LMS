import React, { useState, useEffect, Fragment } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, useParams } from 'react-router-dom'
import { getAllCourses, getOneCourse } from "../../../redux/Courses/CoursesActions"
import { getAllLectures, getCourseLectures, getOneLecture, watchedLecture } from "../../../redux/Lectures/LecturesActions"

import VideoPlayer from "./VideoPlayer"
import VideoBrowser from "./VideoBrowser"
import CourseInfoSection from "./CourseInfoSection"


import "./CourseContainer.css"
import { getLectureComments } from "../../../redux/Comments/CommentsActions"
import Container from "../../Global/Container"
import { getAllTopics } from "../../../redux/Topics/TopicsActions"
import { getAllQuizzes, getQuizRecords } from "../../../redux/Quizzes/QuizzesActions"
import { addCertificate } from "../../../redux/Users/UserActions"

const CourseContainer = props => {
    const [redirect, setRedirect] = useState(false)
    const [showVideo, setShowVideo] = useState(false)
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
    const currentUser = useSelector(state => state.user)
    const topics = useSelector(state => state.topics.allTopics.filter(topic => topic.course_id === currentCourse._id))
    const quizzes = useSelector(state => state.quizzes?.allQuizzes.filter(qz => qz?.course_id === currentCourse?._id))
    const [selectedLecture, setSelectedLecture] = useState(topics[0]?.lectures[0])
    const quizRecordsUser = useSelector(state => state.quizzes.quizRecords.filter(qzr => (qzr.user === currentUser.currentUserData._id && (quizzes.filter(qz => qz._id === qzr.quiz_id).length !== 0))))

    const showQuizzes = quizzes.filter(qz => (topics.filter(tp => tp._id === qz.topic_id).length !== 0))

    const [dataURL, setDataURL] = useState("")

    window.addEventListener('locationchange', stopWatching, false)
    window.addEventListener("beforeunload", stopWatching, false);
    window.addEventListener("unload", stopWatching, false);

    useEffect(() => {
        dispatch(getAllTopics())
        dispatch(getAllQuizzes())
        dispatch(getQuizRecords())
    }, [])
    useEffect(() => {
        if (currentUser.currentUserData.enrolledCourses.includes(currentCourse?._id)) {
            dispatch(getOneLecture({ "id": selectedLecture?._id }))
            dispatch(getLectureComments({ "lecture_id": selectedLecture?._id }))
            if (!(selectedLecture?.watchedBy?.includes(currentUser.currentUserData._id))) {
                const data = {
                    "id": selectedLecture?._id
                }
                dispatch(watchedLecture(data))
            }
        }
        setShowVideo(false)
    }, [selectedLecture])


    useEffect(() => {
        if (currentUser.currentUserData.enrolledCourses.includes(currentCourse?._id)) {
            dispatch({ type: 'user/startWatching', payload: { id: currentCourse?._id } })
            dispatch(getCourseLectures({ "course_id": params.course_id }))
            const data = { "id": params.course_id, "tracking": true }
            dispatch(getOneCourse(data))
            dispatch(getLectureComments({ "lecture_id": selectedLecture?._id }))


            return () => stopWatching()
        }
    }, [])

    return currentUser.currentUserData.enrolledCourses.includes(currentCourse?._id) ? (currentLectures.length > 0 ? (
        <Container details={currentCourse?.name} description={currentCourse?.description} component={
            <div className="course-container">
                <div className="left">
                    {showQuizzes.filter(qz => (quizRecordsUser.filter(qzr => qzr.quiz_id === qz._id).length !== 0)).length === showQuizzes.length ?
                        <NavLink to={"/request_certificate/" + currentCourse._id}><button>Get Certificate</button></NavLink>
                        : null}
                    <div style={{ padding: "20px", paddingTop: "50px" }}>
                        <h1>{selectedLecture.name}</h1>
                        <p>{selectedLecture.content}</p><br />
                        {showVideo === true ? <VideoPlayer url={selectedLecture?.video_file} /> : null}
                    </div>
                    <CourseInfoSection lecture={selectedLecture} course={currentCourse} setShowVideo={setShowVideo} />
                </div>
                <VideoBrowser user_id={currentUser.currentUserData._id} topics={topics} lectures={currentLectures} setSelectedLecture={setSelectedLecture} currentCourse={currentCourse} quizzes={quizzes} />
            </div>
        }>

        </Container>
    ) : <div><center><h3>This course has no lectures in it !</h3></center></div>) : <Container
        details={currentCourse?.name}
        description={currentCourse?.description}
        component={<div><h2>Topics:</h2>{topics.map(topic => <h4>{topic.name}</h4>)}</div>}
    />

}

export default CourseContainer