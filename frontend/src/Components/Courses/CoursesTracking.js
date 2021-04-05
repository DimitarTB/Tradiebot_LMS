import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { coursesTracking, getAllCourses } from '../../redux/Courses/CoursesActions'

import { DataGrid } from '@material-ui/data-grid';
import "./table.css"
import Container from '../Global/Container';

function CoursesTracking() {
    const dispatch = useDispatch()
    const courses = useSelector(state => state.courses)
    const courses_tracking = courses.coursesTracking
    const allCourses = courses.allCourses
    useEffect(() => {
        dispatch(coursesTracking())
        dispatch(getAllCourses("a"))
    }, [])

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'username', headerName: 'Username', width: 130 },
        { field: 'course_id', headerName: 'Course ID', width: 250 },
        {
            field: 'started_watching',
            headerName: 'Started Watching',
            type: 'dateTime',
            // sortComparator: (d1, d2) => d1.getTime() > d2.getTime(),
            width: 250,
        },
        {
            field: 'time_watched',
            headerName: 'Ended watching',
            width: 250,
            type: 'dateTime'
        },
    ];

    const rows = []
    courses_tracking.map(tr => {
        const cc = allCourses?.find(cr => {
            if (cr._id === tr.course_id) return cr
        })
        var ob = { ...tr }
        ob.course_id = cc?.name
        ob.started_watching = Date.parse(ob.started_watching)
        ob.started_watching = new Date(ob.started_watching)

        ob.time_watched = parseInt(ob.time_watched)
        ob.time_watched = ob.started_watching.getTime() + ob.time_watched
        ob.time_watched = new Date(ob.time_watched)
        // ob.time_watched = ((ob.time_watched % 60000) / 1000).toFixed(0)
        rows.push(ob)
    })
    return (
        <Container details="Courses Tracking" description="Track users watched courses" component={
            <div class="table">
                <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[5, 10, 25, 50, 100]} pagination sortModel={[{ field: "started_watching", sort: 'asc' }]} checkboxSelection />
            </div>
        }>
        </Container>
    )
}

export default CoursesTracking
