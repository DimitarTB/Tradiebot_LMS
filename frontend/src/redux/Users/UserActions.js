import { createAsyncThunk } from "@reduxjs/toolkit"
import Axios from "axios"
export const getAllUsers = createAsyncThunk(
    'user/fetchAll',
    async (user, ext) => {
        try {
            const response = await Axios.get("http://127.0.0.1:5000/api/user")
            const data = await response.data
            return data
        } catch (error) {
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

            return await fetch("http://127.0.0.1:5000/api/login", requestOptions)
                .then(response => response.json())
                .then(response => response.token)
                .catch(error => {return ext.rejectWithValue(error.message)});
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

            const response = await fetch("http://127.0.0.1:5000/api/register", requestOptions)
            const data2 = await response.json()
            return data2
        } catch (error) {
            return ext.rejectWithValue(error.message)
        }
    }
)
