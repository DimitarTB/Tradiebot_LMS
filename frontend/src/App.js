import React, { useEffect } from 'react'
import './App.css'
import { statuses } from "./redux/constants"

import { getAllUsers as fetchAll, loginUser } from "./redux/Users/UserActions"
import { useDispatch, useSelector } from "react-redux"
import { getAllCourses, createCourse } from './redux/Courses/CoursesActions'
import { createComment, getAllComments } from "./redux/Comments/CommentsActions"
import { userSlice } from "./redux/Users/UserReducer"
import { createLecture, getAllLectures } from './redux/Lectures/LecturesActions'
import { register } from "./redux/Users/UserActions"


function App() {

    const dispatch = useDispatch()

    const user = useSelector(state => state.user)



    useEffect(() => {
        const userData = { "username": "bk", "password": "1234" }
        console.log("Fetching Users")
        dispatch(loginUser(userData))
    }, [])

    useEffect(() => {
        if (user.loginStatus === statuses.fulfilled) {
            const data = {
                "name": "NewData",
                "description": "NewData, Desct",
                "teachers": ["bozidark35"],
                "token": user.currentUser,
                "username": user.currentUserData.username
            }
            dispatch(createCourse(data))
        }
    }, [user.loginStatus])

    useEffect(() => {
        if (user.loginStatus === statuses.fulfilled) {
            dispatch(getAllCourses(user.currentUser))
            dispatch(getAllComments(user.currentUser))
            const data = {
                "token": user.currentUser,
                "comment": "Komentar",
                "creator_id": "1",
                "lecture_id": "2"
            }
            dispatch(createComment(data))

            dispatch(getAllLectures(user.currentUser))


            const data2 = {
                "name": "Lekcija",
                "course_id": "225",
                "token": user.currentUser
            }
            dispatch(createLecture(data2))

            const data3 = {
                "username": "bozidark35",
                "email": "bozidark35@mail.com",
                "types": ["Student"],
                "password": "1234"
            }
            dispatch(register(data3))
        }
    }, [user.loginStatus])




    return (
        <div className="App">
            {user.loginStatus === statuses.pending ? "Loading, please wait . . ." : null}
            {user.loginStatus === statuses.fulfilled ? "Loaded" : null}
            {user.loginStatus === statuses.rejected ? "Error: " + user.loadingError : null}
        </div>
    )
}

export default App