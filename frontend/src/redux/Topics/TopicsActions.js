import { createAsyncThunk } from "@reduxjs/toolkit"
import { API_URL } from "../constants"

export const getAllTopics = createAsyncThunk(
    'topics/getAllTopics',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            const response = await fetch(API_URL + "api/topic", requestOptions)
            const data = await response.json()
            return data
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const getOneTopic = createAsyncThunk(
    'topics/getOneTopic',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            const response = await fetch(API_URL + "api/topic?id=" + data.id, requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const addTopic = createAsyncThunk(
    'topics/addTopic',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));
            var raw = JSON.stringify({ "name": data.name, "course_id": data.course_id, "index": ext.getState().topics.allTopics.filter(tp => tp.course_id === data.course_id).length });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch(API_URL + "api/topic", requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const addTopicLectures = createAsyncThunk(
    'topics/addTopicLectures',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));
            var lectDict = []
            data.lectures.map((lect, idx) => {
                lectDict.push({ id: (lect.id ? lect.id : lect), index: idx })
            })
            var raw = JSON.stringify({ "lectures": lectDict });
            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            console.log("DispAddTl5")
            const response = await fetch((API_URL + "api/topic?id=" + data.id + "&lecture=1"), requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const changeTopicName = createAsyncThunk(
    'topics/changeTopicName',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));
            var raw = JSON.stringify({ "name": data.name });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch((API_URL + "api/topic?id=" + data.id), requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const deleteTopic = createAsyncThunk(
    'topics/deleteTopic',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));

            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                redirect: 'follow'
            };

            const response = await fetch((API_URL + "api/topic?id=" + data.id), requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const lectureDown = createAsyncThunk(
    'topics/lectureDown',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "topic_id": data.topic_id, "index": data.index });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch((API_URL + "api/lecture_down"), requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const lectureUp = createAsyncThunk(
    'topics/lectureUp',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "topic_id": data.topic_id, "index": data.index });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch((API_URL + "api/lecture_up"), requestOptions)
            const data2 = await response.json()
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const topicDown = createAsyncThunk(
    'topics/topicDown',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "course_id": data.course_id, "index": data.index });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch((API_URL + "api/topic_down"), requestOptions)
            const data2 = await response.json()
            ext.dispatch(getAllTopics())
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)

export const topicUp = createAsyncThunk(
    'topics/topicUp',
    async (data, ext) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + ext.getState().user.currentUser));
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "course_id": data.course_id, "index": data.index });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch((API_URL + "api/topic_up"), requestOptions)
            const data2 = await response.json()
            ext.dispatch(getAllTopics())
            return data2
        }
        catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)