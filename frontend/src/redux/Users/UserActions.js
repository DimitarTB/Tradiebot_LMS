import { createAsyncThunk } from "@reduxjs/toolkit"
import { API_URL } from "../constants"
import axios from "axios"
export const fetchAll = createAsyncThunk(
    'user/fetchAll',
    async (token, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            const response = await fetch(API_URL + "api/user", requestOptions)
            const data = await response.json()
            return data
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (userData, ext) => {
        try {
            console.log(userData)
            var myHeaders = new Headers();
            myHeaders.append("Authorization", JSON.stringify(userData));

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                redirect: 'follow'
            };

            return await fetch(API_URL + "api/login", requestOptions)
                .then(response => response.json())
                .then(response => response.token)
                .catch(error => { return ext.rejectWithValue(error.message) });
        } catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const register = createAsyncThunk(
    'user/register',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "username": data.username, "email": data.email, "password": data.password });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch(API_URL + "api/register", requestOptions)
            const data2 = await response.json()
            if (response.status !== 200) {
                return ext.rejectWithValue(data2.message)
            }
            return data2
        } catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const enrollCourse = createAsyncThunk(
    'user/enrollCourse',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + data.token));

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                redirect: 'follow'
            };


            const response = await fetch((API_URL + "api/course?username=" + data.username + "&course_id=" + data.course_id), requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            console.log("fetch3", error.message)
            return ext.rejectWithValue(error.message)
        }
    }
)

export const unEnrollCourse = createAsyncThunk(
    'user/unEnrollCourse',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + data.token));

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                redirect: 'follow'
            };


            const response = await fetch((API_URL + "api/course?username=" + data.username + "&course_id=" + data.course_id + "&remove=True"), requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            console.log("fetch3", error.message)
            return ext.rejectWithValue(error.message)
        }
    }
)

export const profilePicture = createAsyncThunk(
    'user/profilePicture',
    async (data, ext) => {
        try {
            var formData = new FormData();
            formData.append("image", data.file)
            const response = await axios.post((API_URL + ("api/profile_picture?user=" + data.username)), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': ('Bearer ' + ext.getState().user.currentUser)
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
