import React, { useEffect, useState } from 'react'
import { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import Form, {
    datePicker,
    file,
    input,
    multipleSelect,
    select
} from '../../../react-former/Form'
import { addAssignment } from '../../../redux/Assignments/AssignmentsActions'
import Container from '../../Global/Container'

function AddAssignment() {
    const dispatch = useDispatch()
    const topic_id = useParams().topic_id
    const topic = useSelector(state => state.topics.allTopics.find(tp => tp._id === topic_id))
    const assignmentSelector = useSelector(state => state.assignments)
    const [info, setInfo] = useState({ type: null, message: null })
    const [ff, setFulfilled] = useState(false)
    const [newAssignment, setAssignment] = useState({
        "title": "",
        "description": ""
    })

    const validator = (data, tester) => {
        // for (const field in data) {
        //     if (typeof data[field] !== tester[field]?.type) return setInfo({ type: "warning", message: "Please enter a valid value for the " + field + " field" })
        //     if (data[field] === null && tester[field].isNullable === false) return setInfo({ type: "warning", message: "Field " + field + " is can't be null" })
        //     if (data[field].length < tester[field].minLength) return setInfo({ type: "warning", message: "Field " + field + " must be longer" })
        //     if (data[field].length > tester[field].maxLength) return setInfo({ type: "warning", message: "Field " + field + " must be shorter" })
        // }
        if(data["name"] === null || data["name"] === undefined || data["name"].length < 1) return setInfo({ type: "warning", message: "Please enter a valid value for the Assignment Title field" })
        return true
    }


    useEffect(() => {
        if (ff === true) {
            if (assignmentSelector.addAssignmentStatus === "fulfilled") {
                setInfo({ "type": "success", "message": "Assignment successfully added!" })
                setFulfilled(false)
            }
            else if (assignmentSelector.addAssignmentStatus === "pending") {
                setInfo({ type: "loading", message: "Request is being processed. Please wait." })
            }
        }
    }, [assignmentSelector.addAssignmentStatus])
    return (
        <Container details="Add Assignment" component={
            <div className="global">
                <Form
                    name={"Add a new assignment for " + topic?.name}
                    info={info}
                    buttonText="Proceed"
                    data={newAssignment}
                    handleChange={e => {
                        setInfo({ type: null, message: null })
                        setAssignment({
                            ...newAssignment,
                            [e.target.name]: e.target.value
                        })
                    }}
                    handleSubmit={e => {
                        e.preventDefault()
                        if(validator({"name": newAssignment.title}, "") !== true) return
                        dispatch(addAssignment({ "topic_id": topic_id, "course_id": topic.course_id, "title": newAssignment.title, "description": newAssignment.description }))
                        setFulfilled(true)
                    }
                    }
                    fields={[
                        {
                            name: "title",
                            label: "Assignment Title",
                            placeholder: "Please Enter a Title for the New Assignment",
                            type: "text",
                            fieldType: input
                        },
                        {
                            name: "description",
                            label: "Assignment Description",
                            placeholder: "Please Enter a Description for the New Assignment",
                            type: "textarea",
                            fieldType: input
                        }
                    ]}
                />
            </div>} />)
}

export default AddAssignment
