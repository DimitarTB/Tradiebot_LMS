import React, { useEffect } from 'react'
import { coursesTracking, getAllCourses } from '../../redux/Courses/CoursesActions'
import { DataGrid } from '@material-ui/data-grid';
import { XGrid } from '@material-ui/x-grid';
import { useDispatch, useSelector } from 'react-redux'
import { getQuizRecords } from '../../redux/Quizzes/QuizzesActions'
import Container from '../Global/Container';
import "./quiz.css"

function QuizTracking() {
    const dispatch = useDispatch()
    const quiz = useSelector(state => state.quizzes)
    const quiz_records = quiz.quizRecords
    const user = useSelector(state => state.user)
    const courses = useSelector(state => state.courses)
    useEffect(() => {
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
    quiz_records.map(qzr => {
        var ob = {}
        ob.id = id
        id++
        ob.username = user?.allUsers.find(usr => usr._id === qzr.user)?.username
        const cQuiz = quiz?.allQuizzes.find(qz => qz._id === qzr.quiz_id)
        ob.quiz = cQuiz?.name
        ob.course = courses?.allCourses?.find(crs => crs._id === cQuiz.course_id).name
        ob.time = qzr.time.$date
        var date = new Date(ob.time)
        ob.time = date.toString()
        ob.time = Date.parse(ob.time)
        ob.time = new Date(ob.time)

        ob.points = qzr.points
        ob.passed = qzr.passed === true ? "True" : "False"
        console.log(ob)
        rows.push(ob)
    })
    return (
        <Container details="Quiz Tracking" description="Track quiz records" component={
            <div id="table">
                <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[5, 10, 25, 50, 100]} checkboxSelection ColumnResizeIcon />
            </div>
        }>
        </Container>
        // <div id="table">
        //     <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[5, 10, 25, 50, 100]} checkboxSelection />
        // </div>
    )
}

export default QuizTracking
