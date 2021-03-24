import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from "react-router-dom"
import { coursesTracking, getAllCourses } from '../../redux/Courses/CoursesActions'

import { DataGrid } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import "./table.css"

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
            sortComparator: (d1, d2) => d1.getTime() > d2.getTime(),
            width: 700,
        },
        {
            field: 'time_watched',
            headerName: 'Time Watched (seconds)',
            width: 250,
            type: 'number'
        },
    ];

    const rows = []
    console.log(courses_tracking)
    courses_tracking.map(tr => {
        const cc = allCourses?.find(cr => {
            console.log(cr)
            console.log(tr.course_id)
            if (cr._id === tr.course_id) return cr
        })
        var ob = { ...tr }
        console.log(cc?.name)
        ob.course_id = cc?.name
        ob.started_watching = Date.parse(ob.started_watching)
        ob.started_watching = new Date(ob.started_watching)

        ob.time_watched = parseInt(ob.time_watched)
        ob.time_watched = ((ob.time_watched % 60000) / 1000).toFixed(0)
        rows.push(ob)
    })
    return (
        <div>
            <div class="table">
                <DataGrid rows={rows} columns={columns} pagination={10} sortModel={[{ field: "started_watching", sort: 'asc' }]} checkboxSelection />
            </div>
        </div>
    )
}

export default CoursesTracking
