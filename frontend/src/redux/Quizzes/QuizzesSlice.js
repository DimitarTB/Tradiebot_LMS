import { createSlice, current } from '@reduxjs/toolkit'
import { statuses } from '../constants'
import { getQuizRecords, addCorrectAnswer, addPublicAnswer, addQuestion, createQuiz, deleteCorrectAnswer, deletePublicAnswer, deleteQuestion, getAllQuizzes, submitQuiz, editQuestion, changeQuizName, deleteQuiz } from './QuizzesActions'

export const QuizzesSlice = createSlice({
    name: 'quizzes',
    initialState: {
        allQuizzes: [],
        addStatus: statuses.idle,
        submitQuizStatus: statuses.idle,
        changeNameStatus: statuses.idle,
        quizRecords: [],
        lastSubmitted: null
    },
    reducers: {

    },
    extraReducers: {
        [getAllQuizzes.fulfilled]: (state, action) => {
            state.allQuizzes = action.payload.quizzes
        },
        [createQuiz.fulfilled]: (state, action) => {
            state.allQuizzes.push(action.payload.quiz)
        },

        [addQuestion.fulfilled]: (state, action) => {
            const idx = state.allQuizzes.findIndex(qz => qz._id === action.payload.id)
            if (idx === -1) return
            state.allQuizzes[idx].questions.push(action.payload.question)
            state.addStatus = statuses.fulfilled
        },
        [addQuestion.pending]: (state, action) => {
            state.addStatus = statuses.pending
        },

        [deleteQuestion.fulfilled]: (state, action) => {
            const idx = state.allQuizzes.findIndex(qz => qz._id === action.payload.id)
            if (idx === -1) return

            state.allQuizzes[idx].questions = state.allQuizzes[idx].questions.filter(qs => {
                return qs.question !== action.payload.question
            })
        },

        [addPublicAnswer.fulfilled]: (state, action) => {
            const idx = state.allQuizzes.findIndex(qz => qz._id === action.payload.id)
            state.allQuizzes[idx].questions = action.payload.questions
        },

        [deletePublicAnswer.fulfilled]: (state, action) => {
            const idx = state.allQuizzes.findIndex(qz => qz._id === action.payload.id)
            state.allQuizzes[idx].questions = action.payload.questions
        },

        [addCorrectAnswer.fulfilled]: (state, action) => {
            const idx = state.allQuizzes.findIndex(qz => qz._id === action.payload.id)
            state.allQuizzes[idx].questions = action.payload.questions
        },

        [deleteCorrectAnswer.fulfilled]: (state, action) => {
            const idx = state.allQuizzes.findIndex(qz => qz._id === action.payload.id)
            state.allQuizzes[idx].questions = action.payload.questions
        },

        [getQuizRecords.fulfilled]: (state, action) => {
            state.quizRecords = action.payload
        },

        [submitQuiz.fulfilled]: (state, action) => {
            state.quizRecords.push(action.payload.record)
            state.submitQuizStatus = statuses.fulfilled
            state.lastSubmitted = action.payload.record
        },

        [editQuestion.fulfilled]: (state, action) => {
            const idx = state.allQuizzes.findIndex(qz => qz._id === action.payload.id)
            state.allQuizzes[idx].questions = action.payload.questions
        },

        [changeQuizName.fulfilled]: (state, action) => {
            const idx = state.allQuizzes.findIndex(qz => qz._id === action.payload.id)
            state.allQuizzes[idx].name = action.payload.name
            state.changeNameStatus = statuses.fulfilled
        },
        [changeQuizName.pending]: (state) => {
            state.changeNameStatus = statuses.pending
        },

        [deleteQuiz.fulfilled]: (state, action) => {
            state.allQuizzes = state.allQuizzes.filter(qz => qz._id !== action.payload.id)
        }
    }
})


export const {

} = QuizzesSlice.actions

export default QuizzesSlice.reducer