import { createSlice } from '@reduxjs/toolkit'
import { statuses } from '../constants'
import { getAllLectures, createLecture } from './LecturesActions'

export const LecturesSlice = createSlice({
    name: 'lectures',
    initialState: {
        allLectures: [],
        allFiles: [],
        loadingStatus: statuses.idle,
        createStatus: statuses.idle
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
        }
    }
})


export const {

} = LecturesSlice.actions

export default LecturesSlice.reducer