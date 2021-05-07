import { createSlice } from '@reduxjs/toolkit'
import { statuses } from "../constants"
import { addAssignment, deleteAssignment, getAllAssignments, getAssignmentRecords, rateAssignment, submitAssignment, updateAssignment } from './AssignmentsActions'

export const AssignmentsSlice = createSlice({
    name: 'assignments',
    initialState: {
        allAssignments: [],
        assignmentRecords: [],
        addAssignmentStatus: statuses.idle,
        updateAssignmentStatus: statuses.idle,
        submitAssignmentStatus: statuses.idle,
        rateStatus: statuses.idle,
    },
    reducers: {

    },
    extraReducers: {
        [getAllAssignments.fulfilled]: (state, action) => {
            state.allAssignments = action.payload
        },

        [addAssignment.fulfilled]: (state, action) => {
            state.allAssignments.push(action.payload)
            state.addAssignmentStatus = statuses.fulfilled
        },
        [addAssignment.pending]: (state, action) => {
            state.addAssignmentStatus = statuses.pending
        },

        [updateAssignment.fulfilled]: (state, action) => {
            const idx = state.allAssignments.findIndex(asn => asn._id === action.payload._id)
            state.allAssignments[idx] = action.payload
            state.updateAssignmentStatus = statuses.fulfilled
        },
        [updateAssignment.pending]: (state, action) => {
            state.updateAssignmentStatus = statuses.pending
        },

        [deleteAssignment.fulfilled]: (state, action) => {
            state.allAssignments = state.allAssignments.filter(asn => asn._id !== action.payload._id)
        },

        [submitAssignment.fulfilled]: (state, action) => {
            state.assignmentRecords.push(action.payload)
            state.submitAssignmentStatus = statuses.fulfilled
        },

        [getAssignmentRecords.fulfilled]: (state, action) => {
            state.assignmentRecords = action.payload
        },

        [rateAssignment.fulfilled]: (state, action) => {
            const idx = state.assignmentRecords.findIndex(rec => rec._id === action.payload.id)
            state.assignmentRecords[idx].grade = action.payload.grade
            state.rateStatus = statuses.fulfilled
        },
        [rateAssignment.pending]: (state, action) => {
            state.rateStatus = statuses.pending
        }
    }
})


export const {

} = AssignmentsSlice.actions

export default AssignmentsSlice.reducer