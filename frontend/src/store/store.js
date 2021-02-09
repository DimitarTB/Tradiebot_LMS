import { configureStore } from '@reduxjs/toolkit'
import UserReducer from "../redux/Users/UserReducer"
import CoursesReducer from "../redux/Courses/CoursesSlice"
import LecturesReducer from "../redux/Lectures/LecturesSlice"
import CommentsReducer from "../redux/Comments/CommentsSlice"
import FilesReducer from "../redux/Files/FilesSlice"
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
    files: FilesReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({reducer: persistedReducer})
export const persistor = persistStore(store)


