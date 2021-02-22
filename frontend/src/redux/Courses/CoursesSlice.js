import { createSlice } from '@reduxjs/toolkit'
import { statuses } from "../constants"
import { getAllCourses, createCourse, enrollCourse, editCourse, getOneCourse } from "./CoursesActions"

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

        [getOneCourse.fulfilled]: (state, action) => {
            const idx = state.allCourses.findIndex(crs => crs._id === action.payload.course?._id)
            if (idx === -1) return
            const new_course = action.payload.course
            state.allCourses[idx] = new_course
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

        [editCourse.fulfilled]: (state, action) => {
            let course = state.allCourses.findIndex(course => course._id === action.payload.course_id)
            state.allCourses[course] = action.payload.course
        },
    }
})


export const {

} = CoursesSlice.actions

export default CoursesSlice.reducer