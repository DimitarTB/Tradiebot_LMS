import { configureStore } from '@reduxjs/toolkit'
import UserReducer from "../redux/Users/UserReducer"
import CoursesReducer from "../redux/Courses/CoursesSlice"
import LecturesReducer from "../redux/Lectures/LecturesSlice"
import CommentsReducer from "../redux/Comments/CommentsSlice"
import FilesReducer from "../redux/Files/FilesSlice"
import TopicsReducer from "../redux/Topics/TopicsSlice"
import QuizzesReducer from "../redux/Quizzes/QuizzesSlice"
import AssignmentsReducer from "../redux/Assignments/AssignmentsSlice"
// import {pendingReducer} from "redux-pending"
import { combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
  user: UserReducer,
  courses: CoursesReducer,
  lectures: LecturesReducer,
  comments: CommentsReducer,
  files: FilesReducer,
  topics: TopicsReducer,
  quizzes: QuizzesReducer,
  assignments: AssignmentsReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({ reducer: persistedReducer })
export const persistor = persistStore(store)


