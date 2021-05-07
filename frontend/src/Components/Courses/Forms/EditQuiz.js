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
import { addCorrectAnswer, addPublicAnswer, addQuestion, changeQuizName, deleteCorrectAnswer, deletePublicAnswer, deleteQuestion, editQuestion, getAllQuizzes } from "../../../redux/Quizzes/QuizzesActions"
import { AiOutlineConsoleSql } from "react-icons/ai"
import Container from "../../Global/Container"

export default props => {
    const quiz_id = useParams().id
    const dispatch = useDispatch()
    const quizzes = useSelector(state => state.quizzes)
    const currentQuiz = useSelector(state => state.quizzes?.allQuizzes?.find(quiz => quiz?._id === quiz_id))
    console.log(currentQuiz)
    const [selectedQuestion, setSelectedQuestion] = useState(currentQuiz.questions[0])
    const [info, setInfo] = useState({ type: null, message: null })
    const [quiz, setQuiz] = useState({
        name: currentQuiz.name,
        questions: currentQuiz?.quizQuestions?.map(q => q.question)
    })


    useEffect(() => {
        console.log("selected", selectedQuestion)
    }, [selectedQuestion])
    useEffect(() => {
        setQuiz({
            name: currentQuiz.name,
            questions: currentQuiz?.quizQuestions?.map(q => q.question)
        })
        setSelectedQuestion(currentQuiz?.questions[selectedQuestion?.index])
    }, [currentQuiz])

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
        console.log(quiz)
        console.log(ff)
        if (ff === true) {
            console.log(quiz)
            if (quizzes.addStatus === "fulfilled") {
                setFulfilled(false)
                alert("Question successfully added!")
                setSelectedQuestion(currentQuiz.questions[currentQuiz.questions.length - 1])
                console.log(currentQuiz.questions, selectedQuestion)
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

    useEffect(() => {
        if (ff === true) {
            if (quizzes.changeNameStatus === "fulfilled") {
                setFulfilled(false)
                setInfo({ "type": "success", "message": "Name successfully changed!" })
            }
            else if (quizzes.changeNameStatus === "pending") {
                setInfo({ "type": "loading", "message": "Pending..." })
            }
        }
    }, [quizzes.changeNameStatus])

    return (
        <Container details="Edit Quiz" component={
            <div id="edit-quiz-container">
                <div className="form">
                    <Form
                        name={currentQuiz?.name}
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
                            dispatch(changeQuizName({ "name": quiz.name, "quiz_id": quiz_id }))
                            setFulfilled(true)
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
                        ]}
                    />
                </div>
                <div className="rest">
                    <form
                        onChange={
                            (e) => { setSelectedQuestion(JSON.parse(e.target.value)) }
                        }>
                        <label for="cars">Choose a question:</label>
                        <br />
                        <select name="questions">
                            {currentQuiz.questions.map(qt => {
                                return (
                                    <Fragment>
                                        <option value={JSON.stringify(qt)}>{qt.question}</option>
                                    </Fragment>
                                )
                            })}
                        </select>
                        <br />
                    </form><br />
                    <form onSubmit={
                        (e) => {
                            e.preventDefault()
                            setFulfilled(false)
                            dispatch(addQuestion({
                                question: e.target.quest_name.value,
                                type: e.target.question_types.value,
                                index: currentQuiz.questions.length,
                                quiz_id: currentQuiz._id
                            }))
                            e.target.quest_name.value = ""
                            setFulfilled(true)
                        }
                    }>
                        <label>Add a new question</label>
                        <input name="quest_name" placeholder="New Question"></input>
                        <select name="question_types">
                            <option value="Multiple Choice">Multiple Choice</option>
                            <option value="Single Choice">Single Choice</option>
                            <option value="input">Input</option>
                        </select><br />
                        <button>Add</button>
                    </form>
                </div>
                <div className="rest smaller" style={selectedQuestion ? { visibility: "visible" } : { visibility: "hidden" }}>
                    <form class="question" onSubmit={(e) => {
                        e.preventDefault()
                        dispatch(editQuestion({ "quiz_id": quiz_id, "question": currentQuiz.questions[selectedQuestion.index].question, "question_name": e.target.question.value, "question_type": e.target.question_types.value }))
                    }}>
                        <label for="question">Question</label>
                        <input id="quest_name" name="question" value={selectedQuestion?.question} onChange={e => questionChange(e)}></input><br /><br />
                        <label for="type">Type</label><br />
                        <select name="question_types">
                            <option value="Multiple Choice" selected={selectedQuestion?.type === "Multiple Choice" ? true : false}>Multiple Choice</option>
                            <option value="Input" selected={selectedQuestion?.type === "Input" ? true : false}>Input</option>
                            <option value="Single Choice" selected={selectedQuestion?.type === "Single Choice" ? true : false}>Single Choice</option>
                        </select>
                        <button type="submit">Save</button>
                        <button type="button" id="delete" onClick={(e) => {
                            e.preventDefault()
                            dispatch(deleteQuestion({
                                question: selectedQuestion?.question,
                                type: selectedQuestion?.type,
                                index: currentQuiz?.questions.length,
                                quiz_id: currentQuiz?._id
                            }))
                            setSelectedQuestion(null)
                            document.getElementById("quest_name").value = ""


                        }}>Delete</button>
                    </form>
                </div>
                <div className="rest smaller" style={selectedQuestion ? { visibility: "visible" } : { visibility: "hidden" }}>
                    <br /><br />
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        dispatch(addPublicAnswer({ quiz_id: currentQuiz._id, index: (selectedQuestion === undefined || selectedQuestion === null ? 0 : selectedQuestion.index), answer: e.target.addPublic.value }))
                    }}>
                        <h2>Public answers:</h2>
                        {selectedQuestion?.public_answers?.map(answer => <Fragment><h4>{answer}</h4><p style={{ color: "red" }} onClick={() => {
                            dispatch(deletePublicAnswer({ quiz_id: currentQuiz._id, index: selectedQuestion.index, answer: answer }));
                            let new_ob = { ...selectedQuestion }
                            new_ob.public_answers = selectedQuestion?.public_answers?.filter(pa => pa.answer !== answer)
                            setSelectedQuestion(new_ob)
                        }
                        }>Delete</p><hr /></Fragment>)}
                        <input name="addPublic" placeholder="Answer"></input>
                        <button type="submit" onClick={e => e.preventDefault}>Add</button>
                    </form>
                </div>
                <div className="rest smaller" style={selectedQuestion ? { visibility: "visible" } : { visibility: "hidden" }}>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        dispatch(addCorrectAnswer({ quiz_id: currentQuiz._id, index: selectedQuestion.index, answer: e.target.addCorrect.value }))
                    }}>
                        <h2>Correct answers:</h2>
                        {selectedQuestion?.correct_answers?.map(answer => <Fragment><h4>{answer}</h4><p style={{ color: "red" }} onClick={() => dispatch(deleteCorrectAnswer({ quiz_id: currentQuiz._id, index: selectedQuestion.index, answer: answer }))}>Delete</p><hr /></Fragment>)}
                        <input name="addCorrect" placeholder="Answer"></input>
                        <button type="submit" onClick={e => e.preventDefault}>Add</button>
                    </form>

                </div>
            </div>
        } />)
}