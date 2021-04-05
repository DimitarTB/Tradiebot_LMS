import React, { useEffect } from 'react'
import { coursesTracking, getAllCourses } from '../../redux/Courses/CoursesActions'
import { DataGrid } from '@material-ui/data-grid';
import { useDispatch, useSelector } from 'react-redux'
import { getQuizRecords } from '../../redux/Quizzes/QuizzesActions'
import { Container } from '@material-ui/core';

function QuizTracking() {
    const dispatch = useDispatch()
    const quiz = useSelector(state => state.quizzes)
    const quiz_records = quiz.quizRecords
    const user = useSelector(state => state.user)
    useEffect(() => {
        dispatch(getQuizRecords())
    }, [])


    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'username', headerName: 'Username', width: 130 },
        { field: 'quiz', headerName: 'Quiz', width: 250 },
        {
            field: 'time',
            headerName: 'Time Submitted',
            // sortComparator: (d1, d2) => d1.getTime() > d2.getTime(),
            width: 250,
        },
        {
            field: 'points',
            headerName: 'Points',
            width: 250,
            type: "number"
        },
        {
            field: 'passed',
            headerName: 'Passed',
            width: 250
        }
    ];

    const rows = []
    rows.push({ username: "bk", quiz: "asd", time: "tm", points: "pts", passed: "pass" })
    // quiz_records.map(qzr => {
    //     var ob = {}
    //     ob.id = 0
    //     ob.username = user?.allUsers.find(usr => usr._id === qzr.user)?.username
    //     ob.quiz = quiz?.allQuizzes.find(qz => qz._id === qzr.quiz)?.name
    //     ob.quiz = "asd"
    //     ob.time = qzr.time.$date
    //     var date = new Date(ob.time)
    //     ob.time = date.toString()
    //     ob.points = qzr.points
    //     ob.passed = qzr.passed
    //     console.log(ob)
    //     rows.push(ob)
    // })
    return (
        <div class="table">
            <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[5, 10, 25, 50, 100]} pagination sortModel={[{ field: "started_watching", sort: 'asc' }]} checkboxSelection />
        </div>
    )
}

export default QuizTracking
