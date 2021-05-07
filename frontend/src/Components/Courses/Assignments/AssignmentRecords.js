import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import Container from '../../Global/Container'
import "../../Courses/CourseCard.css"
import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { getAllAssignments, getAssignmentRecords } from '../../../redux/Assignments/AssignmentsActions'

function AssignmentRecords() {
    const dispatch = useDispatch()
    const course_id = useParams().course_id
    const course_assignments = useSelector(state => state.assignments.allAssignments.filter(asn => asn.course_id === course_id))
    const userSelector = useSelector(state => state.user)

    const allUsers = userSelector.allUsers
    var assignment_ids = []
    course_assignments.map(asn => assignment_ids.push(asn._id))
    const records = useSelector(state => state.assignments.assignmentRecords.filter(rec => assignment_ids.includes(rec.assignment_id)))
    useEffect(() => {
        dispatch(getAllAssignments())
        dispatch(getAssignmentRecords())
    }, [])
    return (
        <Container details="Rate Assignments" component={
            <Fragment>
                <h2>Not Rated</h2>
                {records.filter(rec => rec.grade === 0).length === 0 ? <p style={{ margin: "10px", opacity: "0.8" }}>No data to show.</p> : records.map(rec => rec.grade === 0 ? <NavLink to={"/rate_assignment/" + rec._id}><div className="course-card" style={{ height: "5%", minHeight: "5%", maxHeight: "5%" }}>
                    {"Assignment: " + course_assignments.find(asn => asn._id === rec.assignment_id).title}<br />
                    {"User: " + allUsers.find(usr => usr._id === rec.user_id).username}
                </div></NavLink> : null)}
                <h2>Rated</h2>
                {records.filter(rec => rec.grade !== 0).length === 0 ? <p style={{ margin: "10px", opacity: "0.8" }}>No data to show.</p> : records.map(rec => rec.grade !== 0 ? <NavLink to={"/rate_assignment/" + rec._id}><div className="course-card" style={{ height: "5%", minHeight: "5%", maxHeight: "5%" }}>
                    {"Assignment: " + course_assignments.find(asn => asn._id === rec.assignment_id).title}<br />
                    {"User: " + allUsers.find(usr => usr._id === rec.user_id).username}
                </div></NavLink> : null)}
            </Fragment>
        } />
    )
}

export default AssignmentRecords
