import { createSlice } from '@reduxjs/toolkit'
import { statuses } from '../constants'
import { getAllLectures, createLecture, deleteLecture, updateLecture } from './LecturesActions'

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
        },
        
        [deleteLecture.fulfilled]: (state, action) => {
            state.allLectures = state.allLectures.filter(lect => lect._id !== action.payload.id)
        },

        [updateLecture.fulfilled]: (state, action) => {
            const upd_lect = state.allLectures.findIndex(lect => lect._id === action.payload.lecture_id)
            const new_lect = action.payload.lecture
            state.allLectures[upd_lect] = new_lect
        }
    }
})


export const {

} = LecturesSlice.actions

export default LecturesSlice.reducer