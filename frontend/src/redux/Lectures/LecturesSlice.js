import { createSlice, current } from '@reduxjs/toolkit'
import { statuses } from '../constants'
import { getAllLectures, createLecture, deleteLecture, updateLecture, uploadFile, getOneLecture, getCourseLectures, deleteFile, watchedLecture } from './LecturesActions'

export const LecturesSlice = createSlice({
    name: 'lectures',
    initialState: {
        allLectures: [],
        allFiles: [],
        loadingStatus: statuses.idle,
        createStatus: statuses.idle,
        updateStatus: statuses.idle,
        updateError: null,
        filesStatus: statuses.idle
    },
    reducers: {
    },
    extraReducers: {
        [getAllLectures.pending]: (state, action) => {
            state.allLectures = []
            state.loadingStatus = statuses.pending
            state.allFiles = []
        },
        [getAllLectures.fulfilled]: (state, action) => {
            console.log(action)
            state.allLectures = action.payload
            state.loadingStatus = statuses.fulfilled
            console.log("Lectures: ", state.allLectures)

            state.allLectures.forEach(element => {
                state.allFiles = state.allFiles + element.files
            })

            console.log("Files :", state.allFiles)
        },
        [getAllLectures.rejected]: (state, action) => {
            state.loadingError = action.payload
            state.loadingStatus = statuses.rejected
        },

        [getOneLecture.fulfilled]: (state, action) => {
            const idx = state.allLectures.findIndex(lect => lect._id === action.payload.lecture._id)
            if (idx === -1) return
            const new_lect = action.payload.lecture
            state.allLectures[idx] = new_lect
        },

        [getCourseLectures.fulfilled]: (state, action) => {
            state.allLectures = state.allLectures.filter(lect => lect.course_id !== action.payload.course_id)
            state.allLectures.push(...action.payload.lectures)
        },


        [createLecture.pending]: (state, action) => {
            state.createStatus = statuses.pending
        },
        [createLecture.fulfilled]: (state, action) => {
            state.createStatus = statuses.fulfilled
            console.log("Lecture created!", action.payload.id)

            state.allLectures = [...state.allLectures, action.payload.lecture]
        },
        [createLecture.rejected]: (state, action) => {
            state.loadingError = action.payload
            state.createStatus = statuses.rejected
        },

        [deleteLecture.fulfilled]: (state, action) => {
            state.allLectures = state.allLectures.filter(lect => lect._id !== action.payload.id)
        },

        [updateLecture.fulfilled]: (state, action) => {
            const upd_lect = state.allLectures.findIndex(lect => lect._id === action.payload.lecture_id)
            const new_lect = action.payload.lecture
            state.allLectures[upd_lect] = new_lect
            state.updateStatus = statuses.fulfilled
        },
        [updateLecture.pending]: (state, action) => {
            state.updateStatus = statuses.pending
        },
        [updateLecture.rejected]: (state, action) => {
            state.updateStatus = statuses.rejected
            state.updateError = action.payload.message
        },


        [uploadFile.fulfilled]: (state, action) => {
            const idx = state.allLectures.findIndex(lecture => lecture._id = action.payload.id)
            if (idx === -1) return
            console.log(action.payload.files)
            // action.payload.files.forEach(file => state.allLectures[idx].files.push(file))
            state.allLectures[idx].files = state.allLectures[idx].files.concat(action.payload.files)
            state.filesStatus = statuses.fulfilled
            // lecture.files.push(...action.payload.files)
            // console.log(lecture.files)
            // const upd_lect = state.allLectures.findIndex(lect => lect._id === action.payload.id)
            // const new_lect = upd_lect
            // if(Array.isArray(new_lect?.files)) new_lect.files = [...new_lect?.files, action.payload?.files]
            // else new_lect.files = [action.payload?.files]
            // state.allLectures[upd_lect] = new_lect
        },
        [uploadFile.rejected]: (state, action) => {
            state.filesStatus = statuses.rejected
        },
        [uploadFile.pending]: (state, action) => {
            state.filesStatus = statuses.pending
        },
        [deleteFile.fulfilled]: (state, action) => {
            const lectIdx = state.allLectures.findIndex(lect => lect._id === action.payload.id)
            if (lectIdx === -1) return
            console.log(action.payload.id)
            state.allLectures[lectIdx].files = action.payload.files
        },


        [watchedLecture.fulfilled]: (state, action) => {
            const lectIdx = state.allLectures.findIndex(lect => lect._id === action.payload.lecture_id)
            console.log(lectIdx)
            state.allLectures[lectIdx].watchedBy.push(action.payload.user_id)
        }

    }
})


export const {

} = LecturesSlice.actions

export default LecturesSlice.reducer