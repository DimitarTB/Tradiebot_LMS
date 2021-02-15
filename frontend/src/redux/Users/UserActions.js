import { createAsyncThunk } from "@reduxjs/toolkit"
import { API_URL } from "../constants"
import Axios from "axios"
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

            var raw = JSON.stringify({ "email": data.email, "username": data.username, "password": data.password, "types": data.types });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch(API_URL + "api/register", requestOptions)
            const data2 = await response.json()
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


            const response = await fetch(("http://127.0.0.1:5000/api/course?username=" + data.username + "&course_id=" + data.course_id), requestOptions)
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


            const response = await fetch(("http://127.0.0.1:5000/api/course?username=" + data.username + "&course_id=" + data.course_id + "&remove=True"), requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            console.log("fetch3", error.message)
            return ext.rejectWithValue(error.message)
        }
    }
)