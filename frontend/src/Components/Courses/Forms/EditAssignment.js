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
import { addAssignment, getAllAssignments, updateAssignment } from '../../../redux/Assignments/AssignmentsActions'
import Container from '../../Global/Container'

function EditAssignment() {
    const dispatch = useDispatch()
    const asn_id = useParams().id
    const assignmentSelector = useSelector(state => state.assignments)
    const currentAssignment = assignmentSelector.allAssignments.find(asn => asn._id === asn_id)
    const [info, setInfo] = useState({ type: null, message: null })
    const [ff, setFulfilled] = useState(false)
    const [assignment, setAssignment] = useState({
        "title": currentAssignment.title,
        "description": currentAssignment.description
    })

    useEffect(() => {
        dispatch(getAllAssignments())
    }, [])

    useEffect(() => {
        if (ff === true) {
            if (assignmentSelector.updateAssignmentStatus === "fulfilled") {
                setInfo({ "type": "success", "message": "Assignment successfully changed!" })
                setFulfilled(false)
            }
            else if (assignmentSelector.updateAssignmentStatus === "pending") {
                setInfo({ type: "loading", message: "Request is being processed. Please wait." })
            }
        }
    }, [assignmentSelector.updateAssignmentStatus])
    return (
        <Container details="Edit Assignment" component={
            <div className="global">
                <Form
                    name={currentAssignment.title}
                    info={info}
                    buttonText="Proceed"
                    data={currentAssignment}
                    handleChange={e => {
                        setInfo({ type: null, message: null })
                        setAssignment({
                            ...assignment,
                            [e.target.name]: e.target.value
                        })
                    }}
                    handleSubmit={e => {
                        e.preventDefault()
                        dispatch(updateAssignment({ "id": asn_id, "title": assignment.title, "description": assignment.description }))
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

export default EditAssignment
