import { createSlice } from '@reduxjs/toolkit'
import { statuses } from "../constants"
import { createComment, getAllComments } from "./CommentsActions"

export const CommentsSlice = createSlice({
    name: 'comments',
    initialState: {
        loadingStatus: statuses.idle,
        createStatus: statuses.idle,
        allComments: []
    },
    reducers: {

    },
    extraReducers: {
        [getAllComments.pending]: (state, action) => {
            state.allComments = []
            state.loadingStatus = statuses.pending
        },
        [getAllComments.fulfilled]: (state, action) => {
            console.log(action)
            if ( typeof action.payload !== typeof []) state.allComments = []
            else state.allComments = action.payload
            state.loadingStatus = statuses.fulfilled
            console.log("Comments: ", state.allComments)
        },
        [getAllComments.rejected]: (state, action) => {
            state.loadingError = action.payload
            state.loadingStatus = statuses.rejected
        },


        [createComment.pending]: (state, action) => {
            state.createStatus = statuses.pending
        },
        [createComment.fulfilled]: (state, action) => {
            console.log(action)
            state.createStatus = statuses.fulfilled
            console.log("Comment created!")
            state.allComments.push(action.payload.comment)
        },
        [createComment.rejected]: (state, action) => {
            state.loadingError = action.payload
            state.createStatus = statuses.rejected
        }
    }

})


export const {

} = CommentsSlice.actions

export default CommentsSlice.reducer