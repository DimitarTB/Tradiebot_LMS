import React, { useEffect, useState } from 'react'
import { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { NavLink } from 'react-router-dom'
import { getAllCourses } from '../../../redux/Courses/CoursesActions'
import { getAllLectures } from '../../../redux/Lectures/LecturesActions'
import { getAllQuizzes, getQuizRecords } from '../../../redux/Quizzes/QuizzesActions'
import { getAllTopics } from '../../../redux/Topics/TopicsActions'
import { fetchAll, getAllCertificates } from '../../../redux/Users/UserActions'
import Container from '../../Global/Container'
import VideoBrowser from './VideoBrowser'

function CourseNavigator() {
    const course_id = useParams().course_id
    const dispatch = useDispatch()

    const [selectedLecture, setSelectedLecture] = useState(null)

    const courseSelector = useSelector(state => state.courses)
    const currentCourse = courseSelector.allCourses.find(crs => crs._id === course_id)
    const userSelector = useSelector(state => state.user)
    const topics = useSelector(state => state.topics.allTopics.filter(tp => tp.course_id === course_id))
    const quizSelector = useSelector(state => state.quizzes)
    const quizzes = useSelector(state => state.quizzes?.allQuizzes.filter(qz => qz?.course_id === course_id))
    const showQuizzes = quizzes.filter(qz => (topics.filter(tp => tp._id === qz.topic_id).length !== 0))
    const courseLectures = useSelector(state => state.lectures.allLectures.filter(lecture => lecture.course_id === course_id))
    const quizRecordsUser = useSelector(state => state.quizzes.quizRecords.filter(qzr => (qzr.user === userSelector.currentUserData._id && (quizzes.filter(qz => qz._id === qzr.quiz_id).length !== 0))))
    const certificates = userSelector.allCertificates.filter(cert => (cert.course_id === course_id && cert.user_id === userSelector.currentUserData?._id))

    const topicCompleted = () => {
        let watched = true
        courseLectures.map(lect => {
            if (lect.watchedBy)
                if (!(lect.watchedBy.includes(userSelector.currentUserData._id))) watched = false
        })
        return watched
    }


    useEffect(() => {
        dispatch(getAllCourses())
        dispatch(getAllLectures())
        dispatch(getAllTopics())
        dispatch(getAllQuizzes())
        dispatch(getQuizRecords())
        dispatch(getAllQuizzes())
        dispatch(fetchAll())
        dispatch(getAllCertificates())
    }, [])
    return (
        <Container details="Course Navigation" description="Nav"
            component={
                <Fragment>
                    <div id="certificate_course">
                        {(quizzes.filter(qz => (quizRecordsUser.filter(qzr => {
                            return (qzr.quiz_id === qz._id)
                        }).length !== 0)).length === showQuizzes.length) && topicCompleted() === true ? <h3>Congratulations, you have finished this course!</h3> : null}
                        {(quizzes.filter(qz => (quizRecordsUser.filter(qzr => qzr.quiz_id === qz._id).length !== 0)).length === showQuizzes.length) && certificates.length === 0 && topicCompleted() === true ?
                            <Fragment>

                                <NavLink to={"/request_certificate/" + currentCourse?._id}>
                                    <button id="cert">Get Certificate</button>
                                </NavLink>
                            </Fragment>
                            : <h5>{"You can find your certificate in Profile > My Certificates."}</h5>}
                    </div>
                    <VideoBrowser
                        quizzes={quizzes}
                        user_id={userSelector.currentUserData._id}
                        course_id={course_id} topics={topics}
                        lectures={courseLectures} />
                    <div className="nav_bts">
                        {currentCourse?.teachers.includes(userSelector.currentUserData._id) || userSelector.currentUserData.types.includes("SuperAdmin") ? <Fragment>
                            <NavLink className="nav_bt mrg" style={{ marginBottom: "10px" }} to={"/quizzes_tracking_teacher/" + course_id}>
                                <button id="rateAssignments">Quiz Records</button>
                            </NavLink>
                            <NavLink className="nav_bt" to={"/assignment_records/" + course_id}>
                                <button id="rateAssignments">Rate Assignments</button>
                            </NavLink>
                        </Fragment> : null}
                    </div>
                </Fragment>} />
    )
}

export default CourseNavigator
