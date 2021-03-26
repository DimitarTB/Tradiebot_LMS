import { createSlice } from '@reduxjs/toolkit'
import { statuses } from "../constants"
import { getAllCourses, createCourse, enrollCourse, editCourse, getOneCourse, uploadThumbnail, coursesTracking } from "./CoursesActions"

export const CoursesSlice = createSlice({
    name: 'courses',
    initialState: {
        loadingStatus: statuses.idle,
        updateStatus: statuses.idle,
        updateError: null,
        allCourses: [],
        thumbnailStatus: statuses.idle,
        coursesTracking: []
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
            const idx = state.allCourses.findIndex(crs => crs?._id === action.payload.course?._id)
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
            if (action.payload.course === null) return
            let course = state.allCourses.findIndex(course => course._id === action.payload.course_id)
            state.allCourses[course] = action.payload.course
            state.updateStatus = statuses.fulfilled
        },
        [editCourse.pending]: (state, action) => {
            state.updateStatus = statuses.pending
        },
        [editCourse.rejected]: (state, action) => {
            state.updateStatus = statuses.rejected
            state.updateError = action.payload.message
        },

        [uploadThumbnail.fulfilled]: (state, action) => {
            const upd_course = state.allCourses.findIndex(crs => crs._id === action.payload.course_id)
            const new_course = state.allCourses[upd_course]
            new_course.thumbnail = action.payload.thumbnail
            state.allCourses[upd_course] = new_course
            state.thumbnailStatus = statuses.fulfilled
        },
        [uploadThumbnail.rejected]: (state, action) => {
            state.thumbnailStatus = statuses.rejected
        },
        [uploadThumbnail.pending]: (state, action) => {
            state.thumbnailStatus = statuses.pending
        },

        [coursesTracking.fulfilled]: (state, action) => {
            console.log(action)
            var counter = 0;
            action.payload.tracking.map(tr => {
                tr.id = counter
                counter++
            })
            state.coursesTracking = action.payload?.tracking
        },
    }
})


export const {

} = CoursesSlice.actions

export default CoursesSlice.reducer