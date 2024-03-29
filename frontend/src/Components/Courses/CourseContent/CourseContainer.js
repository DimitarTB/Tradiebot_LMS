import React, { useState, useEffect, Fragment } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, useParams } from 'react-router-dom'
import { getAllCourses, getOneCourse } from "../../../redux/Courses/CoursesActions"
import { getCourseLectures, getOneLecture, watchedLecture } from "../../../redux/Lectures/LecturesActions"

import VideoPlayer from "./VideoPlayer"
import VideoBrowser from "./VideoBrowser"
import CourseInfoSection from "./CourseInfoSection"


import "./CourseContainer.css"
import { getLectureComments } from "../../../redux/Comments/CommentsActions"
import Container from "../../Global/Container"
import { getAllTopics } from "../../../redux/Topics/TopicsActions"
import { getAllQuizzes, getQuizRecords } from "../../../redux/Quizzes/QuizzesActions"
import { fetchAll, getAllCertificates } from "../../../redux/Users/UserActions"
import { getAllAssignments, getAssignmentRecords } from "../../../redux/Assignments/AssignmentsActions"
import ReadMoreReact from 'read-more-react';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai"

const CourseContainer = props => {
    const [showVideo, setShowVideo] = useState(false)
    function idleTimer() {
        var t;
        //window.onload = resetTimer;
        window.onmousemove = resetTimer; // catches mouse movements
        window.onmousedown = resetTimer; // catches mouse movements
        window.onclick = resetTimer;     // catches mouse clicks
        window.onscroll = resetTimer;    // catches scrolling
        window.onkeypress = resetTimer;  //catches keyboard actions

        function resetTimer() {
            clearTimeout(t);  // time is in milliseconds (1000 is 1 second)
        }
    }

    useEffect(() => {
        idleTimer()
        dispatch(getAllCourses())
        dispatch(getAllTopics())
        dispatch(getAllQuizzes())
        dispatch(getQuizRecords())
        dispatch(fetchAll())
        dispatch(getAllCertificates())
    }, [])

    function compare(a, b) {
        if (a.index < b.index) {
            return -1;
        }
        if (a.index > b.index) {
            return 1;
        }
        return 0;
    }

    function compare2(a, b) {
        if (a.index > b.index) {
            return -1;
        }
        if (a.index < b.index) {
            return 1;
        }
        return 0;
    }

    const params = useParams()
    const dispatch = useDispatch()


    const courseSelector = useSelector(state => state.courses)
    const lectureSelector = useSelector(state => state.lectures)
    const currentUser = useSelector(state => state.user)
    const quizSelector = useSelector(state => state.quizzes)
    const assignmentSelector = useSelector(state => state.assignments)

    const currentLecture = lectureSelector.allLectures.find(lc => lc._id === params.lecture_id)
    const currentCourse = courseSelector?.allCourses?.find(course => course._id === currentLecture?.course_id)
    const currentLectures = lectureSelector.allLectures.filter(lecture => lecture.course_id === currentLecture.course_id)
    const topicSel = useSelector(state => state.topics.allTopics.find(topic => topic.course_id === currentCourse?._id && topic.lectures.findIndex(lc => lc.id === currentLecture._id) !== -1))


    // const topics = JSON.parse(JSON.stringify(topicSel))
    // topics.sort(compare)
    // topics.map(tp => tp.lectures.sort(compare2))

    const currentQuiz = quizSelector.allQuizzes?.find(qz => qz?.topic_id === topicSel?._id)
    const currentAssignment = assignmentSelector.allAssignments?.find(asn => asn?.topic_id === topicSel?._id)

    const quizzes = useSelector(state => state.quizzes?.allQuizzes.filter(qz => qz?.course_id === currentCourse?._id))
    const quizRecordsUser = useSelector(state => state.quizzes.quizRecords.filter(qzr => (qzr.user === currentUser.currentUserData._id && (quizzes.filter(qz => qz._id === qzr.quiz_id).length !== 0))))
    const certificates = currentUser.allCertificates.filter(cert => (cert.course_id === currentCourse?._id && cert.user_id === currentUser.currentUserData?._id))
    const [selectedLecture, setSelectedLecture] = useState(currentLectures?.find(lect => lect._id === params.lecture_id))
    // const showQuizzes = quizzes.filter(qz => (topics.filter(tp => tp._id === qz.topic_id).length !== 0))

    const current_idx = topicSel?.lectures?.find(lec => lec.id === currentLecture._id)?.index


    const next = currentLectures?.find(lec => lec._id === topicSel?.lectures.find(lc => lc.index === (current_idx + 1))?.id)
    const previous = currentLectures?.find(lec => lec._id === topicSel?.lectures.find(lc => lc.index === (current_idx - 1))?.id)



    function stopWatching() {
        dispatch({ type: 'user/stopWatching', payload: { "id": currentCourse?._id } })
    }


    window.addEventListener('locationchange', stopWatching, false)
    window.addEventListener("beforeunload", stopWatching, false);
    window.addEventListener("unload", stopWatching, false);

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

    // useEffect(() => {
    //     if (selectedLecture === null && topics.find(tp => tp.index === 0)?.lectures.find(lect => lect.index === 0) !== undefined) {

    //         const lect_id = topics.find(tp => tp.index === 0)?.lectures.find(lect => lect.index === 0).id
    //         setSelectedLecture(currentLectures.find(lect => lect._id === lect_id))
    //         // setSelectedLecture(topics.find(tp => tp.index === 0)?.lectures.find(lect => lect.index === 0))
    //     }
    //     else {
    //         if (selectedLecture === null) {
    //             setSelectedLecture(topics[0]?.lectures[0])
    //         }
    //     }
    //     // topics.find(tp => tp.index === 0)?.lectures.find(lect => lect.index === 0)
    // }, [topics])


    useEffect(() => {
        dispatch(getAllAssignments())
        dispatch(getAssignmentRecords())
        if (currentUser.currentUserData.enrolledCourses.includes(currentCourse?._id)) {
            dispatch({ type: 'user/startWatching', payload: { id: currentCourse?._id } })
            dispatch(getCourseLectures({ "course_id": params.course_id }))
            const data = { "id": params.course_id, "tracking": true }
            dispatch(getOneCourse(data))
            dispatch(getLectureComments({ "lecture_id": selectedLecture?._id }))


            return () => stopWatching()
        }
    }, [])

    const topicCompleted = () => {
        let watched = true
        currentLectures.map(lect => {
            if (lect.watchedBy)
                if (!(lect.watchedBy.includes(currentUser.currentUserData._id))) watched = false
        })
        return watched
    }

    return currentUser.currentUserData.enrolledCourses.includes(currentCourse?._id) ? (
        <Container details={currentCourse?.name} description={<ReadMoreReact text={currentCourse.description ? currentCourse.description : ""}
            min={20}
            ideal={150}
            max={2000}
            readMoreText={"Read More..."} />}
            component={
                <div className="course-container">
                    <div className="left">
                        <NavLink to={"/course_nav/" + currentCourse._id}><button className="nav_bt"><AiOutlineArrowLeft />Back to the course</button></NavLink>


                        {/* Certificate and assignment rating */}

                        {/* {currentCourse.teachers.includes(currentUser.currentUserData._id) || currentUser.currentUserData.types.includes("SuperAdmin") ? <Fragment>
                            <NavLink className="nav_bt mrg" style={{ marginBottom: "10px" }} to={"/quizzes_tracking_teacher/" + params.course_id}>
                                <button style={{ width: "130px" }} id="rateAssignments">Quiz Records</button>
                            </NavLink>
                            <NavLink className="nav_bt" to={"/assignment_records/" + params.course_id}>
                                <button style={{ width: "130px" }} id="rateAssignments">Rate Assignments</button>
                            </NavLink>
                        </Fragment> : null} */}


                        {/* {(showQuizzes.filter(qz => (quizRecordsUser.filter(qzr => qzr.quiz_id === qz._id).length !== 0)).length === showQuizzes.length) && topicCompleted() === true ? <h3>Congratulations, you have finished this course!</h3> : null}
                        {(showQuizzes.filter(qz => (quizRecordsUser.filter(qzr => qzr.quiz_id === qz._id).length !== 0)).length === showQuizzes.length) && certificates.length === 0 && topicCompleted() === true ?
                            <Fragment>

                                <NavLink to={"/request_certificate/" + currentCourse._id}>
                                    <button id="cert">Get Certificate</button>
                                </NavLink>
                            </Fragment>
                            : null} */}


                        <div style={{ padding: "20px", paddingTop: "50px" }}>
                            <h1>{selectedLecture?.name}</h1>
                            {/* <p><ReadMoreReact text={selectedLecture !== undefined ? selectedLecture.content : ""}
                                min={20}
                                ideal={150}
                                max={2000}
                                readMoreText={<h5>Read More...</h5>} /></p><br /> */}
                            <p>{selectedLecture?.content}</p><br />
                            {showVideo === true ? <VideoPlayer url={selectedLecture?.video_file} /> : null}
                        </div>
                        <CourseInfoSection lecture={selectedLecture} course={currentCourse} setShowVideo={setShowVideo} />
                        <div id="nav_bts">
                            {/* {window.screen.width <= 1000 ? <VideoBrowser selected={selectedLecture} firstLec={firstLec} user_id={currentUser.currentUserData._id} topics={topics} lectures={currentLectures} setSelectedLecture={setSelectedLecture} currentCourse={currentCourse} quizzes={quizzes} course_id={currentCourse._id} /> : null} */}
                            {previous ? <NavLink to={"/lecture/" + previous._id} onClick={() => setSelectedLecture(previous)}><button className="previous"><AiOutlineArrowLeft />{"Previous: " + previous?.name}</button></NavLink> : null}
                            {next ? <NavLink to={"/lecture/" + next._id} onClick={() => setSelectedLecture(next)}><button className="next">{"Next: " + next?.name}<AiOutlineArrowRight /></button></NavLink> : null}
                            {next ? null : <Fragment>
                                {currentQuiz ? <NavLink to={"/quiz/" + currentQuiz._id}><button className="next">{"Quiz: " + currentQuiz?.name}</button></NavLink> : null}
                                {currentAssignment ? <NavLink to={"/assignment/" + currentAssignment._id}><button className="next">{"Assignment: " + currentAssignment?.title}</button></NavLink> : null}</Fragment>
                            }
                        </div>

                    </div>
                    {/* {window.screen.width <= 1000 ? null : <VideoBrowser selected={selectedLecture} firstLec={firstLec} user_id={currentUser.currentUserData._id} topics={topics} lectures={currentLectures} setSelectedLecture={setSelectedLecture} currentCourse={currentCourse} quizzes={quizzes} course_id={currentCourse._id} />} */}
                </div>
            }>

        </Container>
    ) : <Container details={currentCourse?.name} description="This course has no lectures to show!"></Container >

    // : <Container
    // details={currentCourse?.name}
    // description={currentCourse?.description}
    // component={<div><h2>Topics:</h2>{topics.map(topic => <h4>{topic.name}</h4>)}</div>}
}

export default CourseContainer