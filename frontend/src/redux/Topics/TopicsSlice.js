import { createSlice, current } from '@reduxjs/toolkit'
import { statuses } from '../constants'
import { addTopic, addTopicLectures, changeTopicName, deleteTopic, getAllTopics } from './TopicsActions'

export const TopicsSlice = createSlice({
    name: 'topics',
    initialState: {
        allTopics: [],
        addTopicStatus: statuses.idle
    },
    reducers: {
    },
    extraReducers: {
        [getAllTopics.fulfilled]: (state, action) => {
            console.log(action.payload)
            state.allTopics = action.payload.topics
        },

        [addTopic.fulfilled]: (state, action) => {
            state.allTopics.push(action.payload.topic)
            state.addTopicStatus = statuses.fulfilled
        },
        [addTopic.rejected]: (state, action) => {
            state.addTopicStatus = statuses.rejected
        },
        [addTopic.pending]: (state, action) => {
            state.addTopicStatus = statuses.pending
        },

        [addTopicLectures.fulfilled]: (state, action) => {
            state.allTopics.map(topic => topic._id === action.payload.id ? topic.lectures = action.payload.lectures : "")
        },


        [changeTopicName.fulfilled]: (state, action) => {
            state.allTopics.map(topic => topic._id === action.payload.id ? topic.name = action.payload.name : "")
        },

        [deleteTopic.fulfilled]: (state, action) => {
            state.allTopics = state.allTopics.filter(topic => topic._id !== action.payload.id)
        }

    }
})


export const {

} = TopicsSlice.actions

export default TopicsSlice.reducer