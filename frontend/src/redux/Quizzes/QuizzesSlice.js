import { createSlice, current } from '@reduxjs/toolkit'
import { statuses } from '../constants'
import { createQuiz, getAllQuizzes } from './QuizzesActions'

export const QuizzesSlice = createSlice({
    name: 'quizzes',
    initialState: {
        allQuizzes: []
    },
    reducers: {

    },
    extraReducers: {
        [getAllQuizzes.fulfilled]: (state, action) => {
            state.allQuizzes = action.payload.quizzes
        },
        [createQuiz.fulfilled]: (state, action) => {
            state.allQuizzes.push(action.payload.quiz)
        }
    }
})


export const {

} = QuizzesSlice.actions

export default QuizzesSlice.reducer