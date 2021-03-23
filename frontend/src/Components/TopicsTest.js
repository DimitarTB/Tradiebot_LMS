import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { createQuiz, getAllQuizzes } from '../redux/Quizzes/QuizzesActions'

function TopicsTest() {
    const dispatch = useDispatch()
    const topics = useSelector(state => state.topics)
    useEffect(() => {
        dispatch(getAllQuizzes())
    }, [])
    return (
        <div>
            <button onClick={() => {
                dispatch(createQuiz({ name: "Ime", topic_id: "21", course_id: "22" }))
            }}></button>
        </div>
    )
}

export default TopicsTest
