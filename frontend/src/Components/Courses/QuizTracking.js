import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from "react-router-dom"
import { coursesTracking, getAllCourses } from '../../redux/Courses/CoursesActions'

import { DataGrid } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import "./table.css"
import { getAllQuizzes, getQuizRecords } from '../../redux/Quizzes/QuizzesActions';
import { getAllTopics } from '../../redux/Topics/TopicsActions';

function QuizTracking() {
    const dispatch = useDispatch()
    const quizzes = useSelector(state => state.quizzes)
    const quiz_records = quizzes.quiz_records
    const allTopics = useSelector(state => state.courses.allTopics)
    const allUsers = useSelector(state => state.user.allUsers)
    const allCourses = useSelector(state => state.courses.allCourses)
    useEffect(() => {
        dispatch(getQuizRecords())
        dispatch(getAllQuizzes())
        dispatch(getAllTopics())
    }, [])

    const columns = [
        { field: 'user', headerName: 'User', width: 70 },
        { field: 'quiz', headerName: 'Quiz', width: 130 },
        { field: 'course', headerName: 'Course', width: 250 },
        {
            field: 'time_submitted',
            headerName: 'Time Submitted',
            type: 'dateTime',
            width: 250,
        }
    ];

    const rows = []
    // courses_tracking.map(tr => {
    //     const cc = allCourses?.find(cr => {
    //         if (cr._id === tr.course_id) return cr
    //     })
    //     var ob = { ...tr }
    //     ob.course_id = cc?.name
    //     ob.started_watching = Date.parse(ob.started_watching)
    //     ob.started_watching = new Date(ob.started_watching)

    //     ob.time_watched = parseInt(ob.time_watched)
    //     ob.time_watched = ob.started_watching.getTime() + ob.time_watched
    //     ob.time_watched = new Date(ob.time_watched)
    //     // ob.time_watched = ((ob.time_watched % 60000) / 1000).toFixed(0)
    //     rows.push(ob)
    // })

    quiz_records.map(qzRec => {
        var ob = { ...qzRec }
        ob.user = allUsers.find(usr => usr._id === ob.user).username
        ob.quiz = quizzes.allQuizzes.find(qz => qz._id === ob.quiz_id)
        ob.course = allTopics.find(tp => tp._id === ob.quiz.topic_id)
    })
    return (
        <div>
            <div class="table">
                <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[5, 10, 25, 50, 100]} pagination sortModel={[{ field: "started_watching", sort: 'asc' }]} checkboxSelection />
            </div>
        </div>
    )
}

export default QuizTracking
