import { createAsyncThunk } from "@reduxjs/toolkit"
import { API_URL } from "../constants"
import axios from 'axios'

export const getAllLectures = createAsyncThunk(
    'lectures/getAllLectures',
    async (token, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            const response = await fetch(API_URL + "api/lecture", requestOptions)
            const data = await response.json()
            return data
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const getCourseLectures = createAsyncThunk(
    'lectures/getCourseLectures',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + ext.getState().user.currentUser);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            const response = await fetch(API_URL + "api/lecture?course_id=" + data.course_id, requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const getOneLecture = createAsyncThunk(
    'lectures/getOneLecture',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + ext.getState().user.currentUser);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            const response = await fetch(API_URL + "api/lecture?id=" + data.id, requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const createLecture = createAsyncThunk(
    'lectures/createLecture',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + data.token));
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "name": data.name, "course_id": data.course_id, "video_file": "" });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            }

            const response = await fetch(API_URL + "api/lecture", requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const deleteLecture = createAsyncThunk(
    'lectures/deleteLecture',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + data.token);

            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                redirect: 'follow'
            };
            const response = await fetch(API_URL + "api/lecture?id=" + data.id, requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const updateLecture = createAsyncThunk(
    'lectures/updateLecture',
    async (data, ext) => {
        try {
            console.log("fetch")
            console.log(ext.getState().user.currentUser)
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + ext.getState().user.currentUser);
            myHeaders.append("Content-Type", "application/json");
            console.log("Files:", data.files.length)
            var raw = JSON.stringify({ "name": data.name, "files": data.files, "dateCreated": data.dateCreated, "video_file": data.video_file, "course_id": data.course_id });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            const response = await fetch(API_URL + "api/lecture?id=" + data.id, requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const uploadFile = createAsyncThunk(
    'lectures/uploadFile',
    async (data, ext) => {
        try {
            var formData = new FormData();
            for (let i = 0; i < data.lecture.files.length; i++) {
                formData.append("file", data.lecture.files[i]);
            }
            const response = await axios.post((API_URL + ("api/upload_file?lecture_id=" + data.lecture_id)), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': ('Bearer ' + ext.getState().user.currentUser)
                }
            })
            const data2 = await response.data
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)