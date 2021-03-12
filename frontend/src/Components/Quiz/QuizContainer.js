import React, { useState, useEffect, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Container from "../Global/Container"
import Form, {
    multipleSelect,
    select,
    input
} from '../../react-former/Form'
import { submitQuiz } from '../../redux/Quizzes/QuizzesActions'

export default props => {

    const dispatch = useDispatch()
    const quiz_id = useParams().id

    const [answers, setAnswers] = useState([])

    const quiz = useSelector(state => state?.quizzes?.allQuizzes?.find(qz => qz?._id === quiz_id))

    const [info, setInfo] = useState({ type: null, messagge: null })
    const [submitted, setSubmitted] = useState(false)

    const [page, setSelectedPage] = useState(-1)


    const fields = quiz.questions?.map(question => {
        if (question.type === "Multiple Choice") {
            return {
                name: question.question,
                label: (question.question + " (Choose multiple answers!)"),
                placeholder: "",
                fieldType: multipleSelect,
                options: question.public_answers.map(ans => { return { answer: ans } }),
                displayField: "answer",
                valueField: "answer"
            }
        }
        else if (question.type === "Single Choice") {
            return {
                name: question.question,
                label: (question.question + " (Choose only one answer!)"),
                placeholder: "",
                fieldType: select,
                options: question.public_answers.map(ans => { return { answer: ans } }),
                displayField: "answer",
                valueField: "answer"
            }
        }
        else {
            return {
                name: question.question,
                label: question.question,
                placeholder: "Answer",
                fieldType: input,
                displayField: "answer",
                valueField: "answer"
            }
        }
    })
    console.log(answers)
    return (
        <Container
            details="Course Quiz"
            component={(
                <Fragment>
                    <Form
                        handleChange={e => {
                            setAnswers({
                                ...answers,
                                [e.target.name]: e.target.value
                            })
                        }}
                        handleSubmit={e => {
                            e.preventDefault()

                            const data_answers = []
                            for (const [key, value] of Object.entries(answers)) {
                                console.log(key, value)
                                let vl = value
                                if (!Array.isArray(value)) vl = [vl]
                                const correct_answers = quiz.questions.find(qt => qt.question === key).correct_answers
                                let correct = true
                                vl.map(vl => correct_answers.includes(vl) ? "" : correct = false)
                                data_answers.push({ "question": key, "answer": vl, "correct": correct })
                            }
                            dispatch(submitQuiz({ quiz_id: quiz_id, answers: data_answers }))
                        }}
                        fields={fields.filter(field => field !== undefined)}
                        data={answers}
                        info
                        submitted
                    />
                </Fragment>
            )}
        />
    )

}