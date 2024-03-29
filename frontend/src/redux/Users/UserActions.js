import { createAsyncThunk } from "@reduxjs/toolkit"
import { API_URL } from "../constants"
import axios from "axios"
export const fetchAll = createAsyncThunk(
    'user/fetchAll',
    async (token, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + ext.getState().user.currentUser);

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

export const getOneUser = createAsyncThunk(
    'user/getOneUser',
    async (username, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + ext.getState().user.currentUser);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            const response = await fetch(API_URL + "api/user?username=" + username, requestOptions)
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
            return ext.rejectWithValue(error.message)
        }
    }
)

export const changePassword = createAsyncThunk(
    'user/changePassword',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));
            var raw = JSON.stringify({
                "newPassword": data.newPassword,
                "currentPassword": data.currentPassword
            });
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                redirect: 'follow',
                body: raw
            };

            const response = await fetch((API_URL + "api/change_password?user=" + ext.getState().user.currentUserData.username), requestOptions)
            const data2 = await response.json()
            if (response.status === 401) {
                return ext.rejectWithValue(data2.message)
            }
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const changeUsername = createAsyncThunk(
    'user/changeUsername',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "username": data.username, "email": data.email, "bio": data.bio });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch((API_URL + "api/change_username?user=" + ext.getState().user.currentUserData.username), requestOptions)
            const data2 = await response.json()
            if (response.status === 401) {
                return ext.rejectWithValue(data2.message)
            }
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const addTeacher = createAsyncThunk(
    'user/addTeacher',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                redirect: 'follow'
            };

            const user_id = ext.getState().user.allUsers.find(usr => usr.username === data.username)._id
            const response = await fetch((API_URL + "api/user?id=" + user_id + "&teacher=1"), requestOptions)
            const data2 = await response.json()
            if (response.status === 401) {
                return ext.rejectWithValue(data2.message)
            }
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const removeTeacher = createAsyncThunk(
    'user/removeTeacher',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                redirect: 'follow'
            };

            const response = await fetch((API_URL + "api/user?id=" + data.user_id), requestOptions)
            const data2 = await response.json()
            if (response.status === 401) {
                return ext.rejectWithValue(data2.message)
            }
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const changeUserPassword = createAsyncThunk(
    'user/changeUserPassword',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));

            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "password": data.password, "id": data.id });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch((API_URL + "api/change_user_password"), requestOptions)
            const data2 = await response.json()
            if (response.status === 401) {
                return ext.rejectWithValue(data2.message)
            }
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const unenrollUserCourse = createAsyncThunk(
    'user/unenrollUserCourse',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({ "course_id": data.course_id, "user_id": data.user_id });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            const response = await fetch((API_URL + "api/unenroll_user_course"), requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const enrollUserCourse = createAsyncThunk(
    'user/enrollUserCourse',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({ "course_id": data.course_id, "user_id": data.user_id });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            const response = await fetch((API_URL + "api/enroll_user_course"), requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const activateUser = createAsyncThunk(
    'user/activateUser',
    async (username, ext) => {
        try {
            var myHeaders = new Headers();

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            const response = await fetch((API_URL + "activate?user=" + data.user + "&token=" + data.token), requestOptions)
            const data = await response.json()
            return data
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const getAllCertificates = createAsyncThunk(
    'user/getAllCertificates',
    async (username, ext) => {
        try {
            var myHeaders = new Headers();
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            const response = await fetch((API_URL + "api/certificate"), requestOptions)
            const data = await response.json()
            return data
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)


export const addCertificate = createAsyncThunk(
    'user/addCertificate',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "course_id": data.course_id, "user_id": data.user_id, "data": data.data, "name": data.name, "course_name": ext.getState().courses.allCourses.find(crs => crs._id === data.course_id).name });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            const response = await fetch((API_URL + "api/certificate"), requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)