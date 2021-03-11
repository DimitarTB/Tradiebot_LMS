import { createAsyncThunk } from "@reduxjs/toolkit"
import { API_URL } from "../constants"

export const getAllQuizzes = createAsyncThunk(
    'quizzes/getAllQuizzes',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            const response = await fetch(API_URL + "api/quiz", requestOptions)
            const data = await response.json()
            return data
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const createQuiz = createAsyncThunk(
    'quizzes/createQuiz',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "name": data.name, "topic_id": data.topic_id, "course_id": data.course_id });
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch(API_URL + "api/quiz", requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const addQuestion = createAsyncThunk(
    'quizzes/addQuestion',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "question": data.question, "type": data.type, "public_answers": [], "correct_answers": [], "index": data.index });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch(API_URL + "api/quiz?id=" + data.quiz_id + "&question=1", requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const deleteQuestion = createAsyncThunk(
    'quizzes/deleteQuestion',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "question": data.question, "type": data.type, "public_answers": [], "correct_answers": [], "index": data.index });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch(API_URL + "api/quiz?id=" + data.quiz_id + "&rquestion=1", requestOptions)
            const data2 = await response.json()
            ext.dispatch(getAllQuizzes())
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const addPublicAnswer = createAsyncThunk(
    'quizzes/addPublicAnswer',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "quiz_id": data.quiz_id, "index": data.index, "answer": data.answer });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch(API_URL + "api/public_answer", requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const deletePublicAnswer = createAsyncThunk(
    'quizzes/deletePublicAnswer',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "quiz_id": data.quiz_id, "index": data.index, "answer": data.answer });

            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch(API_URL + "api/public_answer", requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)


export const addCorrectAnswer = createAsyncThunk(
    'quizzes/addCorrectAnswer',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "quiz_id": data.quiz_id, "index": data.index, "answer": data.answer });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch(API_URL + "api/correct_answer", requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const deleteCorrectAnswer = createAsyncThunk(
    'quizzes/deleteCorrectAnswer',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "quiz_id": data.quiz_id, "index": data.index, "answer": data.answer });

            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch(API_URL + "api/correct_answer", requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)