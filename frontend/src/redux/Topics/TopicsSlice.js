import { createSlice, current } from '@reduxjs/toolkit'
import { statuses } from '../constants'
import { addTopic, addTopicLectures, changeTopicName, deleteTopic, getAllTopics, getOneTopic, lectureDown, lectureUp, topicDown, topicUp } from './TopicsActions'

export const TopicsSlice = createSlice({
    name: 'topics',
    initialState: {
        allTopics: [],
        addTopicStatus: statuses.idle
    },
    reducers: {
        addLecturesToTopic: (state, action) => {
            const idx = state.allTopics.findIndex(topic => topic._id === action.payload.id)
            state.allTopics[idx].lectures.push({ id: action.payload.lecture_id, index: action.payload.index })
        }
    },
    extraReducers: {
        [getAllTopics.fulfilled]: (state, action) => {
            console.log(action.payload)
            state.allTopics = action.payload.topics
            state.allTopics.map(tp => tp?.lectures?.sort((a, b) => a.index < b.index ? -1 : a.index > b.index ? 1 : 0))
        },

        [getOneTopic.fulfilled]: (state, action) => {
            const idx = state.allTopics.findIndex(topic => topic._id === action.payload._id)
            state.allTopics[idx] = action.payload
            state.allTopics.map(tp => tp?.lectures?.sort((a, b) => a.index < b.index ? -1 : a.index > b.index ? 1 : 0))
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
            console.log(action.payload.lectures)
            state.allTopics.map(topic => topic._id === action.payload.id ? topic.lectures = action.payload.lectures : "")
            state.allTopics.map(tp => tp?.lectures?.sort((a, b) => a.index < b.index ? -1 : a.index > b.index ? 1 : 0))
        },


        [changeTopicName.fulfilled]: (state, action) => {
            state.allTopics.map(topic => topic._id === action.payload.id ? topic.name = action.payload.name : "")
        },

        [deleteTopic.fulfilled]: (state, action) => {
            state.allTopics = state.allTopics.filter(topic => topic._id !== action.payload.id)
        },
        
        [lectureDown.fulfilled]: (state, action) => {
            const idx = state.allTopics.findIndex(tp => tp._id === action.payload.id)
            state.allTopics[idx].lectures = action.payload.lectures
            state.allTopics.map(tp => tp?.lectures?.sort((a, b) => a.index < b.index ? -1 : a.index > b.index ? 1 : 0))
        },

        [lectureUp.fulfilled]: (state, action) => {
            const idx = state.allTopics.findIndex(tp => tp._id === action.payload.id)
            state.allTopics[idx].lectures = action.payload.lectures
            state.allTopics.map(tp => tp?.lectures?.sort((a, b) => a.index < b.index ? -1 : a.index > b.index ? 1 : 0))
        }

    }
})


export const {

} = TopicsSlice.actions

export default TopicsSlice.reducer