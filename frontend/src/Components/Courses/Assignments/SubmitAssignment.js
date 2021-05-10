import React, { useEffect, useState } from 'react'
import { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useParams } from 'react-router'
import { getAllAssignments, getAssignmentRecords, submitAssignment } from '../../../redux/Assignments/AssignmentsActions'
import Container from '../../Global/Container'
import "./asn.css"

function SubmitAssignment() {
    const asn_id = useParams().id
    const dispatch = useDispatch()
    const assignmentSelector = useSelector(state => state.assignments)
    const assignment = assignmentSelector.allAssignments.find(asn => asn._id === asn_id)
    const currentUser = useSelector(state => state.user)


    const assignmentRecords = assignmentSelector.assignmentRecords?.filter(rec => rec.user_id === currentUser.currentUserData._id && rec.assignment_id === assignment._id)
    console.log(assignmentRecords.length)
    const [file, setFile] = useState(null)
    const [ff, setFulfilled] = useState(false)
    const [redirect, setRedirect] = useState(false)
    useEffect(() => {
        dispatch(getAllAssignments())
        dispatch(getAssignmentRecords())
    }, [])
    useEffect(() => {
        console.log(file)
    }, [file])

    useEffect(() => {
        if (ff === true) {
            if (assignmentSelector.submitAssignmentStatus === "fulfilled") {
                alert("Assignment successfully submitted!\nAfter a teacher will rate your assignment, you can come back here to check your grade.")
                setFulfilled(false)
                setRedirect(true)
            }
        }
    }, [assignmentSelector.submitAssignmentStatus, ff])
    return redirect === false ? (
        <Container details="Submit Assignment"
            component={
                <div className="assignmentContainer">
                    <h2>{assignment?.title}</h2>
                    <p>{assignment?.description}</p>
                    <hr /><br />
                    {assignmentRecords.length === 0 ?
                        <Fragment>
                            <h2>Please upload your assignment answer</h2>
                            <div id="file_form">
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    dispatch(submitAssignment({ "files": e.target.asn.files, "assignment_id": asn_id }))
                                    setFulfilled(true)
                                }}>
                                    <input name="asn" type="file" multiple /><br />
                                    <button type="submit">Submit</button>
                                </form>
                            </div>
                        </Fragment> :
                        <div className="assignmentContainer" style={{ marginBottom: "30px" }}>
                            <h2>You have submitted this assignment!</h2><br />
                            <h3>{assignmentRecords[0].grade === 0 ? "Your assignment is not rated yet." : ("Grade: " + assignmentRecords[0].grade)}</h3><br />
                            {assignmentRecords[0].notes !== "" ? ("Notes: " + assignmentRecords[0].notes) : null}
                        </div>}
                        <button id="back" onClick={() => setRedirect(true)}>Back to the course</button>
                </div>
            } />
    ) : <Redirect to={"/course/" + assignment.course_id} />
}

export default SubmitAssignment
