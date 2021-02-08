import { createAsyncThunk } from "@reduxjs/toolkit"

export const getAllCourses = createAsyncThunk(
    'courses/fetchAll',
    async (token, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            const response = await fetch("http://127.0.0.1:5000/api/course", requestOptions)
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

            var raw = JSON.stringify({ "name": data.name, "description": data.description, "teachers": data.teachers });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            console.log("fetch")

            const response = await fetch(("http://127.0.0.1:5000/api/course?username=" + data.username), requestOptions)
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