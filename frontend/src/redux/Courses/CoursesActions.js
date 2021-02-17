import { createAsyncThunk } from "@reduxjs/toolkit"
import { API_URL } from "../constants"

export const getAllCourses = createAsyncThunk(
    'courses/fetchAll',
    async (token, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);

            console.log("All Courses:", token)

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            const response = await fetch(API_URL + "api/course", requestOptions)
            const data = await response.json()
            return data
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const createCourse = createAsyncThunk(
    'courses/createCourse',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + data.token));
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "name": data.name, "description": data.description, "teachers": data.teachers, "manualEnroll": data.manualEnroll });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            console.log("fetch")

            const response = await fetch((API_URL + "api/course?username=" + data.username), requestOptions)
            console.log("fetch2")
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            console.log("fetch3", error.message)
            return ext.rejectWithValue(error.message)
        }
    }
)

export const addTeacher = createAsyncThunk(
    'courses/addTeacher',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + data.token);

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                redirect: 'follow'
            };

            const response = await fetch((API_URL + "api/course?course=" + data.course_id + "&teacher=" + data.teacher_id), requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            console.log(error.message)
            return ext.rejectWithValue(error.message)
        }
    }
)

export const editCourse = createAsyncThunk(
    'courses/editCourse',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + data.token);
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "name": data.course.name, "description": data.course.description, "teachers": data.course.teachers, "manualEnroll": data.course.manualEnroll, "dateCreated": data.course.dateCreated });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };


            const response = await fetch((API_URL + "api/course?course=" + data.course._id), requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            console.log(error.message)
            return ext.rejectWithValue(error.message)
        }
    }
)