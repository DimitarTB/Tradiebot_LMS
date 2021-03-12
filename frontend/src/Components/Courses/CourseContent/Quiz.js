import React, { useState } from 'react'
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import "./quiz.css"
import Form, {
    multipleSelect,
    select,
    input
} from '../../../react-former/Form'

function Quiz() {
    const quiz_id = useParams().id

    const [answers, setAnswers] = useState([])

    const quiz = useSelector(state => state?.quizzes?.allQuizzes?.find(qz => qz?._id === quiz_id))

    const [page, setSelectedPage] = useState(-1)

    return (
        page === -1 ?
            <div id="quiz"><center>
                <h2>{"Quiz: " + quiz?.name}</h2><br />
                <h2>Are you ready?</h2><br />
                <button onClick={() => setSelectedPage(0)}>Start</button>
            </center></div>
            : (
                <div id="quiz">
                    {quiz?.questions?.find(qs => qs.index === page).question}
                    <button onClick={() => {
                        setSelectedPage(page + 1)
                    }}>{page === (quiz.questions.length - 1) ? "Finish" : "Next"}</button>
                    {page !== 0 ? <button onClick={() => setSelectedPage(page - 1)}>Previous</button> : ""}
                </div>
            )
    )
}

export default Quiz
