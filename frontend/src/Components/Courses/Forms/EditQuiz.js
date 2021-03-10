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
import { getAllQuizzes } from "../../../redux/Quizzes/QuizzesActions"

export default props => {
    const quiz_id = useParams().id
    const dispatch = useDispatch()
    const currentQuiz = useSelector(state => state.quizzes?.allQuizzes?.find(quiz => quiz?._id === quiz_id))
    const quizQuestions = currentQuiz?.questions
    console.log(currentQuiz)
    console.log(quizQuestions)
    const [selectedQuestion, setSelectedQuestion] = useState(quizQuestions[0].index)
    const [info, setInfo] = useState({ type: null, message: null })
    const [quiz, setQuiz] = useState({
        name: currentQuiz.name,
        questions: quizQuestions.map(q => q.question)
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
                    options: quizQuestions,
                    displayField: "question",
                    valueField: "question",
                    special: true
                }
            ]}
        />
        </div>
            <form onChange={(e) => { console.log(e.target.value); setSelectedQuestion(e.target.value) }}>
                <label for="cars">Choose a question:</label>
                <select name="questions">
                    {quizQuestions.map(qt => {
                        return (
                            <option value={qt.index}>{qt.question}</option>
                        )
                    })}
                </select>
                <input type="submit" value="Submit" />
            </form>
            <form>
                <button onClick={(e) => { e.preventDefault(); console.log(selectedQuestion) }}>{quizQuestions?.find(qt => qt.index === parseInt(selectedQuestion))?.question}</button>
            </form>

        </Fragment >
    )
}