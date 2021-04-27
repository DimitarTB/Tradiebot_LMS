import React, { useEffect } from 'react'
import { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { getAssignmentRecords } from '../../../redux/Assignments/AssignmentsActions'
import { FILES_URL, getFileName } from '../../../redux/constants'
import Container from '../../Global/Container'
import "./asn.css"

function RateAssignment() {
    const dispatch = useDispatch()
    // const asn_id = useParams().asn_id
    // const user_id = useParams().user_id
    const record_id = useParams().record_id
    const assignmentSelector = useSelector(state => state.assignments)
    const record = assignmentSelector.assignmentRecords.find(rec => rec._id === record_id)
    const assignment = assignmentSelector.allAssignments.find(asn => asn._id === record.assignment_id)
    useEffect(() => {
        dispatch(getAssignmentRecords())
    }, [])
    return (
        <Container details="Rate this assignment" component={
            <div className="assignmentContainer">
                <h2>{assignment.title}</h2>
                <p>{assignment.description}</p>
                <br /><br />
                <h2>Files</h2>
                <div className="files" style={{ marginBottom: "20px" }}>
                    {record.files.map(file => <Fragment><a href={FILES_URL + file} target="_blank" download>{" " + getFileName(file)}</a><br /></Fragment>)}
                </div>
                <h2>{"Grade: " + (record.grade === 0 ? "Not Rated Yet!" : record.grade)}</h2>
                {/* RATE */}
            </div>
        } />
    )
}

export default RateAssignment
