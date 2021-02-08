import { configureStore } from '@reduxjs/toolkit'
import UserReducer from "../redux/Users/UserReducer"
import CoursesReducer from "../redux/Courses/CoursesSlice"
import LecturesReducer from "../redux/Lectures/LecturesSlice"
import CommentsReducer from "../redux/Comments/CommentsSlice"
import FilesReducer from "../redux/Files/FilesSlice"
import {pendingReducer} from "redux-pending"


export default configureStore({
  reducer: {
    user: UserReducer,
    courses: CoursesReducer,
    lectures: LecturesReducer,
    comments: CommentsReducer,
    files: FilesReducer
  },
});



const Reducer = {
  pending: pendingReducer,
  user: {
    allUsers : [],
    currentUser : "token",
    currentUserData : {},
  },
  courses: {
    allCourses: [],
  },
  lectures: {
    allLectures: []

  },
  comments: {
    allComments: []
  },
  files: {
    allfiles: []
  },
}