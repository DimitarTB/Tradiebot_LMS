import React, { useEffect, useState } from 'react'
import { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useParams } from 'react-router'
import { getAssignmentRecords, rateAssignment } from '../../../redux/Assignments/AssignmentsActions'
import { FILES_URL, getFileName } from '../../../redux/constants'
import { fetchAll } from '../../../redux/Users/UserActions'
import Container from '../../Global/Container'
import "./asn.css"

function RateAssignment() {
    const dispatch = useDispatch()
    // const asn_id = useParams().asn_id
    // const user_id = useParams().user_id
    const record_id = useParams().record_id
    const assignmentSelector = useSelector(state => state.assignments)
    const record = assignmentSelector.assignmentRecords.find(rec => rec._id === record_id)
    const assignment = assignmentSelector.allAssignments.find(asn => asn?._id === record?.assignment_id)

    const userSelector = useSelector(state => state.user)

    const isTeacher = userSelector.currentUserData.types.includes("Teacher") ? true : false

    const [ff, setFulfilled] = useState(false)


    useEffect(() => {
        dispatch(getAssignmentRecords())
        dispatch(fetchAll())
    }, [])

    useEffect(() => {
        if (ff === true) {
            if (assignmentSelector.rateStatus === "fulfilled") {
                setFulfilled(false)
                alert("Data updated successfully!")
            }
        }
    }, [assignmentSelector.rateStatus, ff])
    return isTeacher === false ? <Redirect to="/" /> : (
        <Container details="Rate this assignment" component={
            <div className="assignmentContainer">
                <h2>{"User: " + userSelector?.allUsers?.find(usr => usr._id === record.user_id)?.username}</h2><br />
                <h2>{assignment?.title}</h2>
                <p>{assignment?.description}</p>
                <br /><br />
                <h2>Files</h2>
                <div className="files" style={{ marginBottom: "20px" }}>
                    {record?.files.map(file => <Fragment><a href={FILES_URL + file} target="_blank" download>{" " + getFileName(file)}</a><br /></Fragment>)}
                </div>
                <h2>{"Grade: " + (record?.grade === 0 ? "Not Rated Yet!" : record?.grade)}</h2>
                {/* RATE */}
                <form onSubmit={(e) => {
                    e.preventDefault()
                    dispatch(rateAssignment({ "id": record_id, "grade": parseInt(e.target.grade.value), "notes": e.target.notes.value }))
                    setFulfilled(true)
                }}>
                    <label htmlFor="grade">Choose a grade:</label>
                    <select name="grade" id="grade">
                        {record.grade === 1 ? <option value="1" selected>1</option> : <option value="1">1</option>}
                        {record.grade === 2 ? <option value="2" selected>2</option> : <option value="2">2</option>}
                        {record.grade === 3 ? <option value="3" selected>3</option> : <option value="3">3</option>}
                        {record.grade === 4 ? <option value="4" selected>4</option> : <option value="4">4</option>}
                        {record.grade === 5 ? <option value="5" selected>5</option> : <option value="5">5</option>}
                    </select><br />
                    <label htmlFor="notes">Notes</label>
                    <textarea name="notes" style={{ height: "10%" }} defaultValue={record.notes}></textarea><br />
                    <button type="submit" style={{ color: "white", border: "none", backgroundColor: "var(--primary)", padding: "10px", borderRadius: ".42rem" }}>Submit</button>
                    <br /> <br />
                </form>
            </div>
        } />
    )
}

export default RateAssignment
