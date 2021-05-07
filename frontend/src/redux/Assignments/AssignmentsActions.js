import { createAsyncThunk } from "@reduxjs/toolkit"
import { API_URL } from "../constants"
import axios from 'axios'

export const getAllAssignments = createAsyncThunk(
    'assignments/getAllAssignments',
    async (token, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + ext.getState().user.currentUser);
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            const response = await fetch(API_URL + "api/assignment", requestOptions)
            const data = await response.json()
            return data
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const addAssignment = createAsyncThunk(
    'assignments/addAssignment',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));
            myHeaders.append("Content-Type", "application/json");

            console.log(data)

            var raw = JSON.stringify({
                "course_id": data.course_id,
                "topic_id": data.topic_id,
                "title": data.title,
                "description": data.description
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch(API_URL + "api/assignment", requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const updateAssignment = createAsyncThunk(
    'assignments/updateAssignment',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "title": data.title,
                "description": data.description
            });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch(API_URL + "api/assignment?id=" + data.id, requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const deleteAssignment = createAsyncThunk(
    'assignments/deleteAssignment',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));

            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                redirect: 'follow'
            };

            const response = await fetch(API_URL + "api/assignment?id=" + data.id, requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const submitAssignment = createAsyncThunk(
    'assignments/submitAssignment',
    async (data, ext) => {
        try {
            var formData = new FormData();
            for (let i = 0; i < data.files.length; i++) {
                formData.append("file", data.files[i])
            }
            const response = await axios.post((API_URL + "api/submit_assignment?user=" + ext.getState().user.currentUserData._id + "&assignment=" + data.assignment_id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': ('Bearer ' + ext.getState().user.currentUser),
                }
            })
            const data2 = await response.data
            return data2
        }
        catch (error) {
            console.log("fetch3", error.message)
            return ext.rejectWithValue(error.message)
        }
    }
)

export const getAssignmentRecords = createAsyncThunk(
    'assignments/getAssignmentRecords',
    async (data, ext) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + ext.getState().user.currentUser);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };


        const response = await fetch(API_URL + "api/assignment_records", requestOptions)
        const data2 = await response.json()
        return data2
    }
)

export const rateAssignment = createAsyncThunk(
    'assignments/rateAssignment',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));
            myHeaders.append("Content-Type", "application/json");

            console.log(data)

            var raw = JSON.stringify({
                "id": data.id,
                "grade": data.grade,
                "notes": data.notes
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch(API_URL + "api/rate_assignment", requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)