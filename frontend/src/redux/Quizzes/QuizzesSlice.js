import { createSlice, current } from '@reduxjs/toolkit'
import { statuses } from '../constants'
import { getQuizRecords, addCorrectAnswer, addPublicAnswer, addQuestion, createQuiz, deleteCorrectAnswer, deletePublicAnswer, deleteQuestion, getAllQuizzes, submitQuiz } from './QuizzesActions'

export const QuizzesSlice = createSlice({
    name: 'quizzes',
    initialState: {
        allQuizzes: [],
        addStatus: statuses.idle,
        submitQuizStatus: statuses.idle,
        quizRecords: []
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
            console.log(idx)
            console.log(state.allQuizzes[idx])
            state?.allQuizzes[idx]?.questions.push(action.payload.question)
            state.addStatus = statuses.fulfilled
        },

        [deleteQuestion.fulfilled]: (state, action) => {
            const idx = state.allQuizzes.findIndex(qz => qz._id === action.payload.id)
            if (idx === -1) return

            state.allQuizzes[idx].questions = state.allQuizzes[idx].questions.filter(qs => {
                console.log(qs)
                console.log(action.payload.question)
                return qs.question !== action.payload.question
            })
        },

        [addPublicAnswer.fulfilled]: (state, action) => {
            const idx = state.allQuizzes.findIndex(qz => qz._id === action.payload.id)
            console.log(idx)
            state.allQuizzes[idx].questions = action.payload.questions
            console.log(state.allQuizzes[idx].questions)
        },

        [deletePublicAnswer.fulfilled]: (state, action) => {
            const idx = state.allQuizzes.findIndex(qz => qz._id === action.payload.id)
            console.log(idx)
            state.allQuizzes[idx].questions = action.payload.questions
        },

        [addCorrectAnswer.fulfilled]: (state, action) => {
            const idx = state.allQuizzes.findIndex(qz => qz._id === action.payload.id)
            console.log(idx)
            state.allQuizzes[idx].questions = action.payload.questions
            console.log(state.allQuizzes[idx].questions)
        },

        [deleteCorrectAnswer.fulfilled]: (state, action) => {
            const idx = state.allQuizzes.findIndex(qz => qz._id === action.payload.id)
            console.log(idx)
            state.allQuizzes[idx].questions = action.payload.questions
        },

        [getQuizRecords.fulfilled]: (state, action) => {
            state.quizRecords = action.payload
        },

        [submitQuiz.fulfilled]: (state, action) => {
            state.quizRecords.push(action.payload.record)
            state.submitQuizStatus = statuses.fulfilled
        }
    }
})


export const {

} = QuizzesSlice.actions

export default QuizzesSlice.reducer