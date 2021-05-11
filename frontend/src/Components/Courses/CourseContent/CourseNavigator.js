import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import Container from '../../Global/Container'
import VideoBrowser from './VideoBrowser'

function CourseNavigator() {
    const course_id = useParams().course_id
    
    const [selectedLecture, setSelectedLecture] = useState(null)

    const courseSelector = useSelector(state => state.courses)
    const userSelector = useSelector(state => state.user)
    const topics = useSelector(state => state.topics.allTopics.filter(tp => tp.course_id === course_id))
    const quizzes = useSelector(state => state.quizzes.allQuizzes.filter(qz => qz.course_id === course_id))
    const courseLectures = useSelector(state => state.lectures.allLectures.filter(lect => lect.course_id === course_id))
    return (
        <Container details="Course Navigation" description="Nav"
        component={<VideoBrowser quizzes={quizzes} user_id={userSelector.currentUserData._id} course_id={course_id} topics={topics} lectures={courseLectures} />} />
    )
}

export default CourseNavigator
