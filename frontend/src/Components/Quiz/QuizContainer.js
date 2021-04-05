import React, { useState, useEffect, Fragment } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Container from "../Global/Container"
import Form, {
    multipleSelect,
    select,
    input
} from '../../react-former/Form'
import { getAllQuizzes, getQuizRecords, submitQuiz } from '../../redux/Quizzes/QuizzesActions'
import "./quiz.css"

export default props => {

    const dispatch = useDispatch()
    const quiz_id = useParams().id

    const [answers, setAnswers] = useState([])

    const currentUser = useSelector(state => state?.user)
    const quizSelector = useSelector(state => state?.quizzes)
    const quiz = quizSelector?.allQuizzes?.find(qz => qz?._id === quiz_id)

    const [info, setInfo] = useState({ type: null, messagge: null })
    const [submitted, setSubmitted] = useState(false)

    const [attempts, setAttempts] = useState(0)
    const [highest, setHighest] = useState(null)
    const [lastCompleted, setLastCompleted] = useState(null)


    const [selectedPage, setSelectedPage] = useState(0)

    const [completed, setCompleted] = useState(false)


    // const submitQuiz = () => {
    //     const data_answers = []
    //     for (const [key, value] of Object.entries(answers)) {
    //         console.log(key, value)
    //         let vl = value
    //         if (!Array.isArray(value)) vl = [vl]
    //         const correct_answers = quiz.questions.find(qt => qt.question === key).correct_answers
    //         let correct = true
    //         vl.map(vl => correct_answers.includes(vl) ? "" : correct = false)
    //         data_answers.push({ "question": key, "answer": vl, "correct": correct })
    //     }
    //     dispatch(submitQuiz({ quiz_id: quiz_id, answers: data_answers }))
    //     setCompleted(true)
    // }

    // window.addEventListener('locationchange', submitQuiz, false)
    // window.addEventListener("onbeforeunload", submitQuiz, false);
    // window.addEventListener("onunload", submitQuiz, false);


    // useEffect(() => {
    //     if (selectedPage !== 0) return () => submitQuiz()
    // }, [])


    useEffect(() => {
        setLastCompleted(quizSelector.lastSubmitted)
        if (quizSelector.submitQuizStatus === "fulfilled") console.log("LAST COMPLETED", quizSelector.lastSubmitted)
    }, [quizSelector.submitQuizStatus])
    useEffect(() => {
        dispatch(getQuizRecords())
        dispatch(getAllQuizzes())
    }, [])

    useEffect(() => {
        setCompleted(false)
    }, [])
    useEffect(() => {
        const idx = quizSelector?.quizRecords?.filter(qz => (qz.user === currentUser.currentUserData._id && qz.quiz_id === quiz_id))
        console.log(idx)
        setAttempts(3 - idx.length)
        var highest_p = 0
        idx.map(id => {
            if (id.points > highest_p) {
                highest_p = id.points
                setHighest(id)
            }
        })
        console.log(highest)
    }, [quizSelector?.quizRecords])

    const fields = quiz.questions?.map(question => {
        if (question.type === "Multiple Choice") {
            return {
                name: question.question,
                label: (question.question + " (Choose multiple answers)"),
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
    if (selectedPage !== 0) {
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
                                    vl.map(val => correct_answers.includes(val) ? "" : correct = false)
                                    data_answers.push({ "question": key, "answer": vl, "correct": correct })
                                }
                                dispatch(submitQuiz({ quiz_id: quiz_id, answers: data_answers }))
                                setAttempts(attempts - 1)
                                setCompleted(true)
                                setSelectedPage(0)
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
    else {
        return (
            <Container
                details={quiz.name}
                component={
                    <center>
                        <div class="ready">
                            {attempts > 0 ?
                                <Fragment>
                                    {completed === true ? <h1>{lastCompleted?.passed === true ? ("Congratulations, you completed the quiz with " + lastCompleted?.points + "/" + quiz.questions.length + " points (passed)!") : "You completed the quiz with " + lastCompleted?.points + "/" + quiz.questions.length + " points (failed)!"}</h1> : null}
                                    <h1>Are you ready?</h1>
                                    <h2>{"(" + attempts + " attempts left!)"}</h2><br />
                                    <button onClick={() => setSelectedPage(1)}>Start</button>
                                </Fragment> : <h1>We are sorry, but you have no attempts left for this quiz.</h1>}
                            <h3>{attempts < 3 ? "The best result you got on this quiz is " + highest?.points + "/" + quiz?.questions.length + " (" + (highest?.passed ? "passed" : "failed") + ")" : null}</h3>
                            <NavLink to={"/course/" + quiz.course_id}><button id="back">Back to the course</button></NavLink>
                        </div>
                    </center>
                } />
        )

    }
    // }
    // else {
    //     {
    //         // const completed = quizSelector?.quizRecords?.find(qz => (qz.user === currentUser.currentUserData._id && qz.quiz_id === quiz_id))
    //         return (
    //             <div class="quiz_completed">

    //                 {completed?.passed === true ? <h1>{"Congratulations, you completed the quiz with " + completed?.points + " points!"}</h1> :
    //                     <h1>{"You failed the quiz with " + completed?.points + " points! "}</h1>}

    //             </div>
    //         )
    //     }
    // }
}