import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { getAllQuizzes, getQuizRecords } from '../../redux/Quizzes/QuizzesActions'
import Container from '../Global/Container'
import { DataGrid } from '@material-ui/data-grid';
import "../Quiz/quiz.css"
function TeacherQuizRecords() {
    const dispatch = useDispatch()
    const course_id = useParams().course_id
    const course = useSelector(state => state.courses.allCourses.find(crs => crs._id === course_id))
    const quizSelector = useSelector(state => state.quizzes)
    const quizzes = quizSelector.allQuizzes.filter(qz => qz.course_id === course_id)
    const user = useSelector(state => state.user)
    const ids = []
    quizzes.map(qz => ids.push(qz._id))
    const quizRecords = quizSelector.quizRecords.filter(qzr => ids.includes(qzr.quiz_id))

    useEffect(() => {
        dispatch(getAllQuizzes())
        dispatch(getQuizRecords())
    }, [])

    const columns = [
        { field: 'id', headerName: 'ID', width: 100, resizable: true },
        { field: 'username', headerName: 'Username', width: 250 },
        { field: 'quiz', headerName: 'Quiz', width: 250 },
        { field: 'course', headerName: 'Course', width: 250 },
        {
            field: 'time',
            headerName: 'Time Submitted',
            // sortComparator: (d1, d2) => d1.getTime() > d2.getTime(),
            type: "dateTime",
            width: 200,
        },
        {
            field: 'points',
            headerName: 'Points',
            width: 100,
            type: "number"
        },
        {
            field: 'passed',
            headerName: 'Passed',
            width: 100
        }
    ];

    const rows = []
    var id = 0
    quizRecords.map(qzr => {
        var ob = {}
        ob.id = id
        id++
        ob.username = user?.allUsers.find(usr => usr._id === qzr.user)?.username
        const cQuiz = quizSelector?.allQuizzes.find(qz => qz._id === qzr.quiz_id)
        ob.quiz = cQuiz?.name
        ob.course = course?.name
        ob.time = qzr.time.$date
        var date = new Date(ob.time)
        ob.time = date.toString()
        ob.time = Date.parse(ob.time)
        ob.time = new Date(ob.time)

        ob.points = qzr.points
        ob.passed = qzr.passed === true ? "True" : "False"
        rows.push(ob)
    })
    return (
        <Container details="Quiz Records" description={course?.name} component={
            <div id="table">
                <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[5, 10, 25, 50, 100]} checkboxSelection ColumnResizeIcon />
            </div>
        } />
    )
}

export default TeacherQuizRecords
