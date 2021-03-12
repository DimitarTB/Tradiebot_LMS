import React, { useState, useEffect, Fragment } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, NavLink, Redirect } from "react-router-dom"

import Form, {
    datePicker,
    file,
    input,
    multipleSelect,
    select
} from '../../../react-former/Form'
import "./Edit.css"

import { FcCancel } from "react-icons/fc";
import { addCorrectAnswer, addPublicAnswer, addQuestion, deleteCorrectAnswer, deletePublicAnswer, deleteQuestion, getAllQuizzes } from "../../../redux/Quizzes/QuizzesActions"

export default props => {
    const quiz_id = useParams().id
    const dispatch = useDispatch()
    const quizzes = useSelector(state => state.quizzes)
    const currentQuiz = quizzes?.allQuizzes?.find(quiz => quiz?._id === quiz_id)
    console.log(currentQuiz)
    const [selectedQuestion, setSelectedQuestion] = useState(currentQuiz.questions[0])
    const [info, setInfo] = useState({ type: null, message: null })
    const [quiz, setQuiz] = useState({
        name: currentQuiz.name,
        questions: currentQuiz?.quizQuestions?.map(q => q.question)
    })
    const [ff, setFulfilled] = useState(false)
    const courseValidator = {
        name: {
            type: "string",
            isNullable: false,
            minLength: 3,
            maxLength: 64,
        },
        lectures: {
            type: "object",
            isNullable: true,
            minLength: 0,
            maxLength: 50
        }
    }
    useEffect(() => {
        dispatch(getAllQuizzes())
    }, [])
    const handleChange = e => {

    }



    const handleSubmit = (e) => {
        e.preventDefault();

    }



    const questionChange = (e) => {
        setSelectedQuestion({
            ...selectedQuestion,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        if (ff) {
            if (quizzes.addStatus === "fulfilled") {
                setFulfilled(false)
                alert("Question successfully added!")
            }
        }
    }, [quizzes.addStatus])

    const validator = (data, tester) => {
        for (const field in data) {
            if (typeof data[field] !== tester[field]?.type) return setInfo({ type: "warning", message: "Please enter a valid value for the " + field + " field" })
            if (data[field] === null && tester[field].isNullable === false) return setInfo({ type: "warning", message: "Field " + field + " is can't be null" })
            if (data[field].length < tester[field].minLength) return setInfo({ type: "warning", message: "Field " + field + " must be longer" })
            if (data[field].length > tester[field].maxLength) return setInfo({ type: "warning", message: "Field " + field + " must be shorter" })
        }
        return true
    }

    return (
        <Fragment><div class="form"><Form
            name="Edit Quiz"
            info={info}
            buttonText="Proceed"
            data={quiz}
            handleChange={e => {
                setQuiz({
                    ...quiz,
                    [e.target.name]: e.target.value
                })
            }}
            handleSubmit={e => {
                e.preventDefault()
                // if (validator(course, courseValidator) !== true) return
            }
            }
            fields={[
                {
                    name: "name",
                    label: "Quiz Name",
                    placeholder: "Please Enter Quiz Name",
                    type: "text",
                    fieldType: input
                },
                {
                    name: "questions",
                    label: "Select Questions",
                    placeholder: "Please Select Questions for this quiz",
                    fieldType: multipleSelect,
                    options: currentQuiz.questions,
                    displayField: "question",
                    valueField: "question",
                    special: true
                }
            ]}
        />
        </div>
            <form
                onChange={
                    (e) => { setSelectedQuestion(JSON.parse(e.target.value)) }
                }
                onSubmit={
                    (e) => {
                        e.preventDefault()
                        dispatch(addQuestion({
                            question: e.target.quest_name.value,
                            type: e.target.question_types.value,
                            index: currentQuiz.questions.length,
                            quiz_id: currentQuiz._id
                        }))
                        setFulfilled(true)
                    }
                }>
                <label for="cars">Choose a question:</label>
                <select name="questions">
                    {currentQuiz.questions.map(qt => {
                        return (
                            <Fragment>
                                <option value={JSON.stringify(qt)}>{qt.index + ". " + qt.question}</option>
                            </Fragment>
                        )
                    })}
                </select>
                <input name="quest_name" placeholder="New Question"></input>
                <select name="question_types">
                    <option value="Multiple Choice">Multiple Choice</option>
                    <option value="Single Choice">Single Choice</option>
                    <option value="input">Input</option>
                </select>
                <button type="submit">Add</button>
                <br />
            </form>
            <form class="question">
                <label for="question">Question</label>
                <input name="question" value={selectedQuestion.question} onChange={e => questionChange(e)}></input><br />
                <label for="index">Index</label>
                <input name="index" value={selectedQuestion.index} onChange={e => questionChange(e)}></input>
                <label for="type">Type</label><br />
                <select name="question_types">
                    <option value="Multiple Choice">Multiple Choice</option>
                    <option value="Input">Input</option>
                    <option value="Multiple Select">Multiple Select</option>
                </select>
                <br /><br />
                <button id="delete" onClick={(e) => {
                    e.preventDefault()
                    dispatch(deleteQuestion({
                        question: selectedQuestion.question,
                        type: selectedQuestion.type,
                        index: currentQuiz.questions.length,
                        quiz_id: currentQuiz._id
                    }))
                    setSelectedQuestion(currentQuiz.questions[0])


                }}>Delete</button>
            </form>
            <form onSubmit={(e) => {
                e.preventDefault();
                console.log("ovde")
                dispatch(addPublicAnswer({ quiz_id: currentQuiz._id, index: selectedQuestion.index, answer: e.target.addPublic.value }))
            }}>
                <h2>Public answers:</h2>
                {selectedQuestion?.public_answers?.map(answer => <Fragment><h4>{answer}</h4><p style={{ color: "red" }} onClick={() => {
                    dispatch(deletePublicAnswer({ quiz_id: currentQuiz._id, index: selectedQuestion.index, answer: answer }));
                    let new_ob = selectedQuestion
                    new_ob.public_answers = selectedQuestion?.public_answers?.filter(pa => pa.answer !== answer)
                    setSelectedQuestion(new_ob)
                }
                }>Delete</p><hr /></Fragment>)}
                <input name="addPublic" placeholder="Answer"></input>
                <button type="submit" onClick={e => e.preventDefault}>Add</button>
            </form>
            <form onSubmit={(e) => {
                e.preventDefault()
                dispatch(addCorrectAnswer({ quiz_id: currentQuiz._id, index: selectedQuestion.index, answer: e.target.addCorrect.value }))
            }}>
                <h2>Correct answers:</h2>
                {selectedQuestion?.correct_answers?.map(answer => <Fragment><h4>{answer}</h4><p style={{ color: "red" }} onClick={() => dispatch(deleteCorrectAnswer({ quiz_id: currentQuiz._id, index: selectedQuestion.index, answer: answer }))}>Delete</p><hr /></Fragment>)}
                <input name="addCorrect" placeholder="Answer"></input>
                <button type="submit" onClick={e => e.preventDefault}>Add</button>
            </form>

        </Fragment >
    )
}