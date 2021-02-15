import { createSlice } from '@reduxjs/toolkit'
import { statuses } from "../constants"
import { getAllCourses, createCourse, enrollCourse } from "./CoursesActions"

export const CoursesSlice = createSlice({
    name: 'courses',
    initialState: {
        loadingStatus: statuses.idle,
        allCourses: []
    },
    reducers: {
    },
    extraReducers: {
        [getAllCourses.pending]: (state, action) => {
            state.allCourses = []
            state.loadingStatus = statuses.pending
        },
        [getAllCourses.fulfilled]: (state, action) => {
            console.log(action)
            state.allCourses = action.payload
            state.loadingStatus = statuses.fulfilled
            console.log("Courses: ", state.allCourses)
        },
        [getAllCourses.rejected]: (state, action) => {
            state.loadingError = action.payload
            state.loadingStatus = statuses.rejected
        },


        [createCourse.pending]: (state, action) => {
            state.loadingStatus = statuses.pending
        },
        [createCourse.fulfilled]: (state, action) => {
            state.loadingStatus = statuses.fulfilled
            state.allCourses.push(action.payload.new_course)
        },
        [createCourse.rejected]: (state, action) => {
            state.loadingError = action.payload
            state.loadingStatus = statuses.rejected
        },
    }
})


export const {

} = CoursesSlice.actions

export default CoursesSlice.reducer