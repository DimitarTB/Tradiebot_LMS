import { createAsyncThunk } from "@reduxjs/toolkit"
import { API_URL } from "../constants"
import axios from 'axios'

export const getAllCourses = createAsyncThunk(
    'courses/fetchAll',
    async (token, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + ext.getState().user.currentUser);


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

export const getOneCourse = createAsyncThunk(
    'courses/getOneCourse',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + ext.getState().user.currentUser);
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            var fetch_url = API_URL + "api/course?id=" + data.id
            if (data.tracking) {
                fetch_url = fetch_url + "&tracking=1"
            }
            const response = await fetch(fetch_url, requestOptions)
            const data2 = await response.json()
            return data2
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
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({ "name": data.name, "description": data.description, "teachers": data.teachers, "manualEnroll": data.manualEnroll });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch((API_URL + "api/course?username=" + data.username), requestOptions)
            const data2 = await response.json()

            if (response.status === 200) {
                ext.dispatch({ type: 'user/addCreatedCourse', payload: { new_course: data2.new_course, _id: data2.inserted_id } })
            }

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

            var raw = JSON.stringify({ "name": data.course.name, "description": data.course.description, "teachers": data.course.teachers, "manualEnroll": data.course.manualEnroll, "dateCreated": data.course.dateCreated, "thumbnail": data.thumbnail });

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

export const uploadThumbnail = createAsyncThunk(
    'courses/uploadThumbnail',
    async (data, ext) => {
        try {
            console.log("Thumbnail22")
            var formData = new FormData();
            formData.append("image", data.file)
            const response = await axios.post((API_URL + ("api/upload_thumbnail?course_id=" + data.id)), formData, {
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

export const coursesTracking = createAsyncThunk(
    'courses/coursesTracking',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            const response = await axios.get(API_URL + "api/courses_tracking", {
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